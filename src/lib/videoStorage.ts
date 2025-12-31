/**
 * Video Storage using GitHub Repository
 * Videos are committed as files to the public/videos directory in the repository
 */

import { Octokit } from 'octokit'

const VIDEOS_DIR = 'public/videos'
const THUMBNAILS_DIR = 'public/thumbnails'

/**
 * Get repository info from environment or config
 */
function getRepoInfo(): { owner: string; repo: string } | null {
  const repoUrl = import.meta.env.VITE_REPO_URL || 'https://github.com/pewpi-infinity/truvio-studios'
  const match = repoUrl.match(/github\.com\/([^\/]+)\/([^\/]+)/)
  if (match) {
    return { owner: match[1], repo: match[2].replace('.git', '') }
  }
  return null
}

/**
 * Convert File to base64
 */
async function fileToBase64(file: File): Promise<string> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader()
    reader.onload = () => {
      const base64 = (reader.result as string).split(',')[1]
      resolve(base64)
    }
    reader.onerror = reject
    reader.readAsDataURL(file)
  })
}

/**
 * Convert data URL to base64
 */
function dataUrlToBase64(dataUrl: string): string {
  return dataUrl.split(',')[1]
}

/**
 * Store a video file in the repository
 */
export async function storeVideo(
  id: string,
  videoFile: File,
  thumbnailDataUrl: string,
  metadata: {
    title: string
    description: string
    hashtags: string[]
    createdAt: number
    ownerId: string
  }
): Promise<{ videoPath: string; thumbnailPath: string }> {
  const repoInfo = getRepoInfo()
  if (!repoInfo) {
    throw new Error('Repository information not available')
  }

  try {
    // Get GitHub token from Spark
    const user = await window.spark.user()
    if (!user?.token) {
      throw new Error('GitHub authentication required')
    }

    const octokit = new Octokit({ auth: user.token })

    // Convert files to base64
    const videoBase64 = await fileToBase64(videoFile)
    const thumbnailBase64 = dataUrlToBase64(thumbnailDataUrl)

    // Generate file paths
    const videoExt = videoFile.name.split('.').pop() || 'mp4'
    const videoPath = `${VIDEOS_DIR}/${id}.${videoExt}`
    const thumbnailPath = `${THUMBNAILS_DIR}/${id}.png`

    // Get the current branch reference
    const { data: ref } = await octokit.rest.git.getRef({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      ref: 'heads/main'
    })

    const currentCommitSha = ref.object.sha

    // Get the current commit to get the tree
    const { data: currentCommit } = await octokit.rest.git.getCommit({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      commit_sha: currentCommitSha
    })

    // Create blobs for video and thumbnail
    const { data: videoBlob } = await octokit.rest.git.createBlob({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      content: videoBase64,
      encoding: 'base64'
    })

    const { data: thumbnailBlob } = await octokit.rest.git.createBlob({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      content: thumbnailBase64,
      encoding: 'base64'
    })

    // Create a new tree with the video and thumbnail files
    const { data: newTree } = await octokit.rest.git.createTree({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      base_tree: currentCommit.tree.sha,
      tree: [
        {
          path: videoPath,
          mode: '100644',
          type: 'blob',
          sha: videoBlob.sha
        },
        {
          path: thumbnailPath,
          mode: '100644',
          type: 'blob',
          sha: thumbnailBlob.sha
        }
      ]
    })

    // Create a new commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      message: `Add video: ${metadata.title}`,
      tree: newTree.sha,
      parents: [currentCommitSha]
    })

    // Update the reference
    await octokit.rest.git.updateRef({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      ref: 'heads/main',
      sha: newCommit.sha
    })

    return { videoPath, thumbnailPath }
  } catch (error) {
    console.error('Failed to store video in repository:', error)
    throw error
  }
}

/**
 * Get video URL from repository
 */
export async function getVideoUrl(videoPath: string): Promise<string | null> {
  // Return the path relative to the base URL
  const basePath = import.meta.env.BASE_URL || '/truvio-studios/'
  return `${basePath}${videoPath}`
}

/**
 * Get thumbnail URL from repository
 */
export async function getVideoThumbnail(thumbnailPath: string): Promise<string | null> {
  const basePath = import.meta.env.BASE_URL || '/truvio-studios/'
  return `${basePath}${thumbnailPath}`
}

/**
 * Delete a video from repository
 */
export async function deleteVideo(videoPath: string, thumbnailPath: string): Promise<void> {
  const repoInfo = getRepoInfo()
  if (!repoInfo) {
    throw new Error('Repository information not available')
  }

  try {
    const user = await window.spark.user()
    if (!user?.token) {
      throw new Error('GitHub authentication required')
    }

    const octokit = new Octokit({ auth: user.token })

    // Get the current branch reference
    const { data: ref } = await octokit.rest.git.getRef({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      ref: 'heads/main'
    })

    const currentCommitSha = ref.object.sha

    // Get the current commit to get the tree
    const { data: currentCommit } = await octokit.rest.git.getCommit({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      commit_sha: currentCommitSha
    })

    // Create a new tree without the video and thumbnail files
    const { data: newTree } = await octokit.rest.git.createTree({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      base_tree: currentCommit.tree.sha,
      tree: [
        {
          path: videoPath,
          mode: '100644',
          type: 'blob',
          sha: null as any // This deletes the file
        },
        {
          path: thumbnailPath,
          mode: '100644',
          type: 'blob',
          sha: null as any
        }
      ]
    })

    // Create a new commit
    const { data: newCommit } = await octokit.rest.git.createCommit({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      message: `Delete video files`,
      tree: newTree.sha,
      parents: [currentCommitSha]
    })

    // Update the reference
    await octokit.rest.git.updateRef({
      owner: repoInfo.owner,
      repo: repoInfo.repo,
      ref: 'heads/main',
      sha: newCommit.sha
    })
  } catch (error) {
    console.error('Failed to delete video from repository:', error)
    throw error
  }
}

/**
 * Legacy function stubs for compatibility
 */
export async function getAllVideoIds(): Promise<string[]> {
  // This is no longer needed as videos are tracked in KV store
  return []
}

export async function videoExists(id: string): Promise<boolean> {
  // This is no longer needed as videos are tracked in KV store
  return true
}


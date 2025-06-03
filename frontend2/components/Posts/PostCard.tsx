'use client';
import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart, MessageCircle, Share2, Download, MoreHorizontal, User, Flag, X, Send, ChevronLeft, ChevronRight } from 'lucide-react';
import html2canvas from 'html2canvas';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Post, likesAPI, commentsAPI, Comment } from '@/lib/api';
import { formatDistanceToNow } from 'date-fns';

interface ImageCarouselProps {
  images: string[];
}

function ImageCarousel({ images }: ImageCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0);

  const nextImage = () => {
    setCurrentIndex((prev) => (prev + 1) % images.length);
  };

  const prevImage = () => {
    setCurrentIndex((prev) => (prev - 1 + images.length) % images.length);
  };

  return (
    <div className="relative rounded-lg overflow-hidden bg-gray-100 dark:bg-gray-700">
      {/* Current Image */}
      <div className="relative aspect-[4/3] w-full">
        <img
          src={images[currentIndex]}
          alt={`Post media ${currentIndex + 1}`}
          className="w-full h-full object-cover"
        />
        
        {/* Navigation Buttons */}
        {images.length > 1 && (
          <>
            <Button
              variant="ghost"
              size="sm"
              onClick={prevImage}
              className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 w-8 h-8"
            >
              <ChevronLeft className="w-4 h-4" />
            </Button>
            
            <Button
              variant="ghost"
              size="sm"
              onClick={nextImage}
              className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-black/50 hover:bg-black/70 text-white rounded-full p-2 w-8 h-8"
            >
              <ChevronRight className="w-4 h-4" />
            </Button>
          </>
        )}
        
        {/* Image Counter */}
        {images.length > 1 && (
          <div className="absolute top-3 right-3 bg-black/50 text-white text-xs px-2 py-1 rounded-full">
            {currentIndex + 1} / {images.length}
          </div>
        )}
      </div>
      
      {/* Dots Indicator */}
      {images.length > 1 && (
        <div className="absolute bottom-3 left-1/2 transform -translate-x-1/2 flex space-x-2">
          {images.map((_, index) => (
            <button
              key={index}
              onClick={() => setCurrentIndex(index)}
              className={`w-2 h-2 rounded-full transition-colors ${
                index === currentIndex 
                  ? 'bg-white' 
                  : 'bg-white/50 hover:bg-white/75'
              }`}
            />
          ))}
        </div>
      )}
    </div>
  );
}

interface PostCardProps {
  post: Post;
  onLike?: (postId: string) => void;
  onComment?: (postId: string) => void;
}

export default function PostCard({ post, onLike, onComment }: PostCardProps) {
  const router = useRouter();
  const postRef = useRef<HTMLDivElement>(null);
  const [isLiked, setIsLiked] = useState(post.hasUserLikedPost);
  const [likesCount, setLikesCount] = useState(post.numberOfLikes);
  const [loading, setLoading] = useState(false);
  
  // Comments state
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState<Comment[]>([]);
  const [newComment, setNewComment] = useState('');
  const [commentsLoading, setCommentsLoading] = useState(false);
  
  // Report modal state
  const [showReportModal, setShowReportModal] = useState(false);
  const [reportReason, setReportReason] = useState('');
  const [reportDetails, setReportDetails] = useState('');
  
  // Screenshot state
  const [showScreenshotModal, setShowScreenshotModal] = useState(false);
  const [screenshotLoading, setScreenshotLoading] = useState(false);
  const [screenshotUrl, setScreenshotUrl] = useState<string | null>(null);

  const handleLike = async () => {
    if (loading) return;
    
    setLoading(true);
    try {
      await likesAPI.togglePostLike(post._id);
      setIsLiked(!isLiked);
      setLikesCount(prev => isLiked ? prev - 1 : prev + 1);
      onLike?.(post._id);
    } catch (error) {
      console.error('Failed to toggle like:', error);
    } finally {
      setLoading(false);
    }
  };

  const fetchComments = async () => {
    if (commentsLoading) return;
    
    setCommentsLoading(true);
    try {
      const fetchedComments = await commentsAPI.getComments(post._id);
      setComments(fetchedComments);
    } catch (error) {
      console.error('Failed to fetch comments:', error);
      setComments([]);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleComment = async () => {
    setShowComments(true);
    if (comments.length === 0) {
      await fetchComments();
    }
    onComment?.(post._id);
  };

  const handleAddComment = async () => {
    if (!newComment.trim() || commentsLoading) return;
    
    setCommentsLoading(true);
    try {
      const comment = await commentsAPI.createComment(post._id, newComment.trim());
      setComments(prev => [comment, ...prev]);
      setNewComment('');
      // Update post comment count if needed
    } catch (error) {
      console.error('Failed to add comment:', error);
    } finally {
      setCommentsLoading(false);
    }
  };

  const handleUsernameClick = () => {
    router.push(`/profile/${post.postedBy.username}`);
  };

  const handleReport = () => {
    setShowReportModal(true);
  };
  const handleSubmitReport = () => {
    if (!reportReason.trim()) return;
    
    // Here you would typically send the report to your API
    console.log('Report submitted:', {
      postId: post._id,
      reason: reportReason,
      details: reportDetails
    });
    
    // Reset form and close modal
    setReportReason('');
    setReportDetails('');
    setShowReportModal(false);
    
    // Show success message or toast
    alert('Report submitted successfully. Thank you for helping keep our community safe.');
  };  const handleScreenshot = async () => {
    if (screenshotLoading) return;
    
    setScreenshotLoading(true);
    try {      // Create an isolated iframe to completely avoid CSS inheritance
      const iframe = document.createElement('iframe');
      iframe.style.position = 'fixed';
      iframe.style.top = '-9999px';
      iframe.style.left = '-9999px';
      iframe.style.width = '600px';
      iframe.style.height = 'auto';
      iframe.style.border = 'none';
      iframe.style.backgroundColor = '#ffffff';
      
      document.body.appendChild(iframe);
      
      // Wait for iframe to load
      await new Promise((resolve) => {
        iframe.onload = resolve;
        if (iframe.contentDocument) {
          resolve(null);
        }
      });
      
      const iframeDoc = iframe.contentDocument || iframe.contentWindow?.document;
      if (!iframeDoc) {
        throw new Error('Cannot access iframe document');
      }
      
      // Clear any default styles and add basic HTML structure
      iframeDoc.open();
      iframeDoc.write(`
        <!DOCTYPE html>
        <html>
        <head>
          <meta charset="UTF-8">
          <style>
            * {
              margin: 0;
              padding: 0;
              box-sizing: border-box;
              background: transparent !important;
              color: inherit !important;
            }            body {
              font-family: Arial, sans-serif;
              font-size: 14px;
              line-height: 1.5;
              color: #000000;
              background: #ffffff !important;
              padding: 12px;
              margin: 0;
              min-height: 30vh;
              max-height: 30vh;
              
            }
            .post-container {
              background: #ffffff !important;
              border: 1px solid #e5e7eb;
              border-radius: 12px;
              padding: 16px;
              color: #000000;
              margin: 0;
              height:100%;
            }
            .header {
              display: flex;
              align-items: center;
              margin-bottom: 12px;
            }
            .profile-pic {
              width: 40px;
              height: 40px;
              border-radius: 50%;
              background: #e5e7eb !important;
              margin-right: 12px;
              display: flex;
              align-items: center;
              justify-content: center;
              overflow: hidden;
              font-size: 16px;
              font-weight: bold;
              color: #6b7280;
            }
            .profile-pic img {
              width: 100%;
              height: 100%;
              object-fit: cover;
            }
            .user-name {
              font-weight: bold;
              font-size: 14px;
              color: #000000;
              margin-bottom: 2px;
            }
            .user-handle {
              font-size: 12px;
              color: #6b7280;
            }
            .content {
              margin-bottom: 16px;
              font-size: 14px;
              line-height: 1.5;
              color: #000000;
            }
            .hashtag {
              color: #3b82f6;
              font-weight: 500;
            }
            .media-container {
              margin-top: 12px;
            }
            .media-img {
              width: 100%;
              border-radius: 8px;
              margin-bottom: 8px;
            }
            .stats {
              display: flex;
              align-items: center;
              gap: 16px;
              margin-top: 12px;
              padding-top: 12px;
              border-top: 1px solid #e5e7eb;
              font-size: 12px;
              color: #6b7280;
            }            .watermark {
              margin-top: 8px;
              text-align: center;
              font-size: 12px;
              color: #6b7280;
              border-top: 1px solid #e5e7eb;
              padding-top: 8px;
            }
          </style>
        </head>
        <body>
          <div class="post-container">
            <div class="header">
              <div class="profile-pic" id="profile-pic">
                ${post.postedBy.profilepic 
                  ? `<img src="${post.postedBy.profilepic}" alt="${post.postedBy.name}" />` 
                  : post.postedBy.name.charAt(0).toUpperCase()
                }
              </div>
              <div>
                <div class="user-name">${post.postedBy.name}</div>
                <div class="user-handle">@${post.postedBy.username} • ${formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}</div>
              </div>
            </div>
            <div class="content" id="content"></div>
            ${post.mediaFile && post.mediaFile.length > 0 ? `
              <div class="media-container">
                ${post.mediaFile.map(media => `<img src="${media}" class="media-img" />`).join('')}
              </div>
            ` : ''}
            <div class="stats">
              <span>♥ ${likesCount} likes</span>
              <span>💬 ${post.numberOfComments} comments</span>
            </div>
          </div>
          <div class="watermark">Shared from SocialFlow</div>
        </body>
        </html>
      `);
      iframeDoc.close();
      
      // Add caption with hashtag processing
      const contentDiv = iframeDoc.getElementById('content');
      if (contentDiv) {
        const captionParts = post.caption.split(/(#\w+)/g);
        captionParts.forEach(part => {
          if (part.match(/^#\w+$/)) {
            const hashtagSpan = iframeDoc.createElement('span');
            hashtagSpan.textContent = part;
            hashtagSpan.className = 'hashtag';
            contentDiv.appendChild(hashtagSpan);
          } else {
            const textSpan = iframeDoc.createElement('span');
            textSpan.textContent = part;
            contentDiv.appendChild(textSpan);
          }
        });
      }
      
      // Wait for images to load
      const images = iframeDoc.querySelectorAll('img');
      if (images.length > 0) {
        await Promise.all(Array.from(images).map(img => {
          return new Promise((resolve) => {
            if (img.complete) {
              resolve(null);
            } else {
              img.onload = () => resolve(null);
              img.onerror = () => resolve(null);
              setTimeout(() => resolve(null), 3000);
            }
          });
        }));
      }
      
      // Add delay for complete rendering
      await new Promise(resolve => setTimeout(resolve, 1000));      // Generate screenshot of iframe body
      const canvas = await html2canvas(iframeDoc.body, {
        useCORS: true,
        allowTaint: true,
        logging: false,
        background: '#ffffff',
        height: iframeDoc.body.scrollHeight,
        width: iframeDoc.body.scrollWidth
      });
    
      
      // Remove iframe
      document.body.removeChild(iframe);
      
      // Convert to blob and create URL
      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          setScreenshotUrl(url);
          setShowScreenshotModal(true);
        }
      }, 'image/png', 0.95);
      
    } catch (error) {
      console.error('Failed to generate screenshot:', error);
      alert('Failed to generate screenshot. Please try again.');
    } finally {
      setScreenshotLoading(false);
    }
  };

  const handleDownloadScreenshot = () => {
    if (!screenshotUrl) return;
    
    const link = document.createElement('a');
    link.href = screenshotUrl;
    link.download = `socialflow-post-${post._id}.png`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };  const handleShareToSocial = (platform: string) => {
    const postText = `Check out this post from SocialFlow: "${post.caption.substring(0, 100)}${post.caption.length > 100 ? '...' : ''}"`;
    const postUrl = `${window.location.origin}/post/${post._id}`;
    
    let shareUrl = '';
    
    switch (platform) {
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?text=${encodeURIComponent(postText)}&url=${encodeURIComponent(postUrl)}`;
        break;
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${encodeURIComponent(`${postText}\n\n${postUrl}`)}`;
        break;
    }
    
    if (shareUrl) {
      // Copy to clipboard as well
      const fullShareText = `${postText}\n\n${postUrl}`;
      navigator.clipboard.writeText(fullShareText).then(() => {
        console.log('Share link copied to clipboard');
      });
      
      // Open social platform
      window.open(shareUrl, '_blank', 'width=600,height=400');
    }
  };

  const handleHashtagClick = (hashtag: string) => {
    const searchQuery = hashtag.startsWith('#') ? hashtag : `#${hashtag}`;
    const params = new URLSearchParams({
      q: searchQuery,
      type: 'posts'
    });
    router.push(`/search?${params.toString()}`);
  };

  const renderCaptionWithHashtags = (caption: string) => {
    const parts = caption.split(/(#\w+)/g);
    
    return parts.map((part, index) => {
      if (part.match(/^#\w+$/)) {
        return (
          <button
            key={index}
            onClick={() => handleHashtagClick(part)}
            className="text-blue-500 hover:text-blue-600 hover:underline font-medium"
          >
            {part}
          </button>
        );
      }
      return <span key={index}>{part}</span>;
    });
  };  return (
    <motion.div
      ref={postRef}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
      className="bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg p-4 mb-4 shadow-sm hover:shadow-md transition-shadow"
    >
      {/* Post Header */}
      <div className="flex items-center justify-between mb-3">        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
            {post.postedBy.profilepic ? (
              <img 
                src={post.postedBy.profilepic} 
                alt={post.postedBy.name}
                className="w-10 h-10 rounded-full object-cover"
              />
            ) : (
              <User className="w-5 h-5 text-gray-500 dark:text-gray-400" />
            )}
          </div>          <div>
            <h3 className="font-semibold text-sm cursor-pointer hover:underline text-gray-900 dark:text-white" 
                onClick={handleUsernameClick}>
              {post.postedBy.name}
            </h3>
            <p className="text-xs text-gray-500 dark:text-gray-400">
              <span className="cursor-pointer hover:underline" onClick={handleUsernameClick}>
                @{post.postedBy.username}
              </span> • {formatDistanceToNow(new Date(post.createdAt), { addSuffix: true })}
            </p>
          </div>
        </div>        
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" size="sm">
              <MoreHorizontal className="w-4 h-4" />
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuItem onClick={handleReport} className="text-red-600 focus:text-red-600">
              <Flag className="w-4 h-4 mr-2" />
              Report Post
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>      {/* Post Content */}
      <div className="mb-3">
        <div className="text-sm leading-relaxed text-gray-900 dark:text-white">
          {renderCaptionWithHashtags(post.caption)}
        </div>
          {/* Media Files - Carousel */}
        {post.mediaFile && post.mediaFile.length > 0 && (
          <div className="mt-3">
            {post.mediaFile.length === 1 ? (
              <img
                src={post.mediaFile[0]}
                alt="Post media"
                className="rounded-lg max-w-full h-auto"
              />
            ) : (
              <ImageCarousel images={post.mediaFile} />
            )}
          </div>
        )}
      </div>      {/* Post Actions */}
      <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700" data-actions>
        <div className="flex items-center space-x-4">
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLike}
            disabled={loading}
            className="flex items-center space-x-2 hover:bg-red-50"
          >
            <Heart 
              className={`w-4 h-4 ${isLiked ? 'fill-red-500 text-red-500' : 'text-gray-500'}`} 
            />
            <span className="text-sm">{likesCount}</span>
          </Button>
          
          <Button
            variant="ghost"
            size="sm"
            onClick={handleComment}
            className="flex items-center space-x-2 hover:bg-blue-50"
          >
            <MessageCircle className="w-4 h-4 text-blue-500" />
            <span className="text-sm">{post.numberOfComments}</span>
          </Button>          <Button
            variant="ghost"
            size="sm"
            onClick={handleScreenshot}
            disabled={screenshotLoading}
            className="flex items-center justify-center hover:bg-purple-50"
            title="Share post"
          >
            <Share2 className="w-4 h-4 text-purple-500" />
          </Button>
        </div>
      </div>{/* Comments Modal */}
      <AnimatePresence>
        {showComments && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 dark:bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowComments(false)}
          ><motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Comments
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowComments(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              {/* Add Comment Form */}
              <div className="mb-4 space-y-2">
                <Input
                  placeholder="Write a comment..."
                  value={newComment}
                  onChange={(e) => setNewComment(e.target.value)}
                  onKeyPress={(e) => {
                    if (e.key === 'Enter' && !e.shiftKey) {
                      e.preventDefault();
                      handleAddComment();
                    }
                  }}
                />
                <Button
                  onClick={handleAddComment}
                  disabled={!newComment.trim() || commentsLoading}
                  className="w-full"
                >
                  <Send className="w-4 h-4 mr-2" />
                  {commentsLoading ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>              {/* Comments List */}
              <div className="space-y-3">
                {commentsLoading && comments.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    Loading comments...
                  </div>
                ) : comments.length === 0 ? (
                  <div className="text-center py-4 text-gray-500 dark:text-gray-400">
                    No comments yet. Be the first to comment!
                  </div>
                ) : (
                  comments.map((comment) => (
                    <div key={comment._id} className="flex space-x-3">
                      <div className="w-8 h-8 rounded-full flex items-center justify-center bg-gray-100 dark:bg-gray-700">
                        {comment.commentedBy.profilepic ? (
                          <img
                            src={comment.commentedBy.profilepic}
                            alt={comment.commentedBy.name}
                            className="w-8 h-8 rounded-full object-cover"
                          />
                        ) : (
                          <User className="w-4 h-4 text-gray-500 dark:text-gray-400" />
                        )}
                      </div>
                      <div className="flex-1">
                        <div className="rounded-lg p-3 bg-gray-100 dark:bg-gray-700">
                          <div className="flex items-center space-x-2 mb-1">
                            <span className="font-semibold text-sm text-gray-900 dark:text-white">
                              {comment.commentedBy.name}
                            </span>
                            <span className="text-xs text-gray-500 dark:text-gray-400">
                              @{comment.commentedBy.username}
                            </span>
                          </div>
                          <p className="text-sm text-gray-900 dark:text-white">{comment.content}</p>
                        </div>
                        <p className="text-xs mt-1 text-gray-500 dark:text-gray-400">
                          {formatDistanceToNow(new Date(comment.createdAt), { addSuffix: true })}
                        </p>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>      {/* Report Modal */}
      <AnimatePresence>
        {showReportModal && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 dark:bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => setShowReportModal(false)}
          ><motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-6 w-full max-w-md shadow-xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >              <div className="flex items-center justify-between mb-4">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Report Post
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setShowReportModal(false)}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-4">                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Why are you reporting this post?
                  </label>
                  <select
                    value={reportReason}
                    onChange={(e) => setReportReason(e.target.value)}
                    className="w-full p-2 border border-gray-300 dark:border-gray-600 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-white dark:bg-gray-700 text-gray-900 dark:text-white"
                  >
                    <option value="">Select a reason</option>
                    <option value="spam">Spam</option>
                    <option value="harassment">Harassment or bullying</option>
                    <option value="hate-speech">Hate speech</option>
                    <option value="violence">Violence or threats</option>
                    <option value="inappropriate">Inappropriate content</option>
                    <option value="false-information">False information</option>
                    <option value="copyright">Copyright violation</option>
                    <option value="other">Other</option>
                  </select>
                </div>                <div>
                  <label className="block text-sm font-medium mb-2 text-gray-700 dark:text-gray-300">
                    Additional details (optional)
                  </label>
                  <Textarea
                    placeholder="Please provide more details about why you're reporting this post..."
                    value={reportDetails}
                    onChange={(e) => setReportDetails(e.target.value)}
                    rows={3}
                    className="bg-white dark:bg-gray-700 border-gray-300 dark:border-gray-600 text-gray-900 dark:text-white"
                  />
                </div>

                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => setShowReportModal(false)}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitReport}
                    disabled={!reportReason.trim()}
                    className="flex-1 bg-red-600 hover:bg-red-700 text-white"
                  >
                    Submit Report
                  </Button>
                </div>
              </div>
            </motion.div>          </motion.div>
        )}
      </AnimatePresence>
        {/* Screenshot Modal */}
      <AnimatePresence>
        {showScreenshotModal && screenshotUrl && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-gray-900/50 dark:bg-black/50 flex items-center justify-center z-50 p-4"
            onClick={() => {
              setShowScreenshotModal(false);
              if (screenshotUrl) {
                URL.revokeObjectURL(screenshotUrl);
                setScreenshotUrl(null);
              }
            }}
          >            <motion.div
              initial={{ scale: 0.95, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.95, opacity: 0 }}
              className="bg-white dark:bg-gray-800 rounded-lg p-4 w-full max-w-md max-h-[80vh] overflow-y-auto shadow-xl border border-gray-200 dark:border-gray-700"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-white">
                  Share Post
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => {
                    setShowScreenshotModal(false);
                    if (screenshotUrl) {
                      URL.revokeObjectURL(screenshotUrl);
                      setScreenshotUrl(null);
                    }
                  }}
                >
                  <X className="w-4 h-4" />
                </Button>
              </div>
                {/* Screenshot Preview */}
              <div className="mb-4">
                <img 
                  src={screenshotUrl} 
                  alt="Post screenshot"
                  className="w-full max-h-80 object-contain rounded-lg border border-gray-200 dark:border-gray-600"
                />
              </div>
              
              {/* Download Button */}
              <div className="mb-4">
                <Button
                  onClick={handleDownloadScreenshot}
                  className="w-full flex items-center justify-center space-x-2 bg-gradient-to-r from-purple-500 to-blue-500 hover:from-purple-600 hover:to-blue-600 text-white"
                >
                  <Download className="w-4 h-4" />
                  <span>Download Screenshot</span>
                </Button>
              </div>
              
              {/* Social Share Options */}
              <div className="space-y-3">
                <h4 className="text-sm font-medium text-gray-700 dark:text-gray-300">
                  Share to:
                </h4>
                <div className="grid grid-cols-2 gap-2">
                  <Button
                    variant="outline"
                    onClick={() => handleShareToSocial('twitter')}
                    className="flex items-center justify-center space-x-2 text-xs py-2 border-blue-400 hover:bg-blue-50 hover:border-blue-500"
                  >
                    <svg className="w-4 h-4 text-blue-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                    </svg>
                    <span>X (Twitter)</span>
                  </Button>
                  
                  <Button
                    variant="outline"
                    onClick={() => handleShareToSocial('whatsapp')}
                    className="flex items-center justify-center space-x-2 text-xs py-2 border-green-500 hover:bg-green-50 hover:border-green-600"
                  >
                    <svg className="w-4 h-4 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893A11.821 11.821 0 0020.885 3.488"/>
                    </svg>
                    <span>WhatsApp</span>
                  </Button>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}

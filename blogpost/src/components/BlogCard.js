// components/BlogCard.js
import { useState } from 'react';
import { useSession } from 'next-auth/react';
import axios from 'axios';

export default function BlogCard({ blog, onUpdate }) {
  const { data: session } = useSession();
  const [comment, setComment] = useState('');
  const [showComments, setShowComments] = useState(false);

  const handleUpvote = async () => {
    try {
      const { data } = await axios.post(`/api/blogs/${blog._id}/upvote`);
      onUpdate(data);
    } catch (error) {
      console.error('Error upvoting:', error);
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const { data } = await axios.post(`/api/blogs/${blog._id}/comments`, {
        content: comment,
      });
      onUpdate(data);
      setComment('');
    } catch (error) {
      console.error('Error commenting:', error);
    }
  };

  return (
    <div className="border rounded-lg p-4 mb-4">
      <h2 className="text-xl font-bold">{blog.title}</h2>
      <p className="text-gray-600 mb-2">By {blog.author.name}</p>
      <div className="prose max-w-none mb-4">{blog.content}</div>
      
      <div className="flex items-center gap-4 mb-4">
        <button
          onClick={handleUpvote}
          className="flex items-center gap-2 text-blue-500"
        >
          <span>{blog.upvotes.length} Upvotes</span>
        </button>
        <button
          onClick={() => setShowComments(!showComments)}
          className="text-blue-500"
        >
          {blog.comments.length} Comments
        </button>
      </div>

      {showComments && (
        <div className="mt-4">
          <form onSubmit={handleComment} className="mb-4">
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              className="w-full border rounded p-2"
              placeholder="Add a comment..."
              required
            />
            <button
              type="submit"
              className="bg-blue-500 text-white px-4 py-2 rounded mt-2"
            >
              Comment
            </button>
          </form>

          <div className="space-y-4">
            {blog.comments.map((comment, i) => (
              <div key={i} className="border-l-2 pl-4">
                <p className="font-semibold">{comment.user.name}</p>
                <p className="text-gray-600">{comment.content}</p>
                <p className="text-sm text-gray-400">
                  {new Date(comment.createdAt).toLocaleDateString()}
                </p>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}

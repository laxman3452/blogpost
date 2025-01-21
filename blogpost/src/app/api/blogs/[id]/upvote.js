// pages/api/blogs/[id]/upvote.js
import dbConnect from '../../../../lib/mongodb';
import Blog from '../../../../models/Blog';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  if (!session) {
    return res.status(401).json({ error: 'Not authenticated' });
  }

  const { id } = req.query;
  await dbConnect();

  if (req.method === 'POST') {
    try {
      const blog = await Blog.findById(id);
      const hasUpvoted = blog.upvotes.includes(session.user.id);

      if (hasUpvoted) {
        blog.upvotes = blog.upvotes.filter(
          (userId) => userId.toString() !== session.user.id
        );
      } else {
        blog.upvotes.push(session.user.id);
      }

      await blog.save();
      res.status(200).json(blog);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

import dbConnect from '../../../lib/mongodb';
import Blog from '../../../models/Blog';
import { getSession } from 'next-auth/react';

export default async function handler(req, res) {
  const session = await getSession({ req });
  await dbConnect();

  switch (req.method) {
    case 'GET':
      try {
        const blogs = await Blog.find()
          .populate('author', 'name email')
          .populate('comments.user', 'name')
          .populate('comments.replies.user', 'name')
          .sort({ createdAt: -1 });
        res.status(200).json(blogs);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    case 'POST':
      if (!session) {
        return res.status(401).json({ error: 'Not authenticated' });
      }
      try {
        const blog = await Blog.create({
          ...req.body,
          author: session.user.id,
        });
        res.status(201).json(blog);
      } catch (error) {
        res.status(400).json({ error: error.message });
      }
      break;

    default:
      res.status(405).json({ error: 'Method not allowed' });
      break;
  }
}
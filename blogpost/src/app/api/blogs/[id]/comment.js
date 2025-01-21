
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
      blog.comments.push({
        user: session.user.id,
        content: req.body.content,
      });
      await blog.save();
      res.status(201).json(blog);
    } catch (error) {
      res.status(400).json({ error: error.message });
    }
  } else {
    res.status(405).json({ error: 'Method not allowed' });
  }
}

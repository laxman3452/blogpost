'use client';

import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { useEffect, useState } from 'react';
import axios from 'axios';
import BlogCard from '@/components/BlogCard';

export default function Page() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [blogs, setBlogs] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // If not authenticated, redirect to login
    if (status === 'unauthenticated') {
      router.push('/auth/login');
    } else if (status === 'authenticated') {
      fetchBlogs();
    }
  }, [status, router]);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const { data } = await axios.get('/api/blogs', {
        headers: {
          Authorization: `Bearer ${session?.user?.accessToken}`,
        },
      });
      setBlogs(data);
    } catch (error) {
      console.error('Error fetching blogs:', error);
    } finally {
      setLoading(false);
    }
  };

  if (status === 'loading' || loading) {
    return <div className="flex justify-center items-center min-h-screen">Loading...</div>;
  }

  return (
    <div className="max-w-4xl mx-auto p-4">
      <h1 className="text-3xl font-bold mb-8">Blog Posts</h1>
      {session && (
        <a
          href="/create"
          className="bg-blue-500 text-white px-4 py-2 rounded mb-8 inline-block"
        >
          Create New Post
        </a>
      )}
      <div className="space-y-6">
        {blogs.map((blog) => (
          <BlogCard
            key={blog._id}
            blog={blog}
            onUpdate={handleBlogUpdate}
          />
        ))}
      </div>
    </div>
  );
}
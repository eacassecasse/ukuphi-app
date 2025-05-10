import React from "react";
import { Link } from "react-router-dom";

const blogPosts = [
  {
    id: 1,
    title: "Top 10 Summer Festivals You Can't Miss",
    excerpt: "Summer is here, and it's time to plan your festival adventures! Check out our top picks for this season's must-attend events.",
    date: "June 1, 2025",
    author: "Lois Nkeiru",
    image: "https://plus.unsplash.com/premium_photo-1719467541072-7b53ae7e93c4?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8OXx8c3VtbWVyJTIwZmVzdGl2YWxzfGVufDB8fDB8fHww"
  },
  {
    id: 2,
    title: "How to Plan a Successful Corporate Event",
    excerpt: "Planning a corporate event can be challenging. Follow these tips to ensure your next business gathering is a hit!",
    date: "May 15, 2025",
    author: "Kessiena Arhata",
    image: "https://plus.unsplash.com/premium_photo-1719066378763-452e7629561d?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjF8fHN1bW1lciUyMGZlc3RpdmFsc3xlbnwwfHwwfHx8MA%3D%3D"
  },
  {
    id: 3,
    title: "The Rise of Virtual Events: What You Need to Know",
    excerpt: "Virtual events are becoming increasingly popular. Learn about the latest trends and technologies shaping the future of online gatherings.",
    date: "April 28, 2025",
    author: "Edmilson Johnson",
    image: "https://images.unsplash.com/photo-1568222115029-c93fd44cbd32?w=700&auto=format&fit=crop&q=60&ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxzZWFyY2h8MjN8fHN1bW1lciUyMGZlc3RpdmFsc3xlbnwwfHwwfHx8MA%3D%3D"
  }
];

const Blog = () => {
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-4xl font-bold mb-6">Blog</h1>
      <p className="mb-8 text-lg">Stay tuned for the latest updates and articles about upcoming events, trends, and tips!</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        {blogPosts.map((post) => (
          <div key={post.id} className="bg-white rounded-lg shadow-md overflow-hidden">
            <img src={post.image} alt={post.title} className="w-full h-48 object-cover" />
            <div className="p-6">
              <h2 className="text-xl font-bold mb-2">{post.title}</h2>
              <p className="text-gray-600 mb-4">{post.excerpt}</p>
              <div className="flex justify-between items-center text-sm text-gray-500">
                <span>{post.date}</span>
                <span>By {post.author}</span>
              </div>
              <Link to={`/blog/${post.id}`} className="mt-4 inline-block bg-blue-500 text-white px-4 py-2 rounded hover:bg-orange-700">
                Read More
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default Blog;


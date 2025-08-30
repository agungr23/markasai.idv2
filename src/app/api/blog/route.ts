import { NextRequest, NextResponse } from 'next/server';
import {
  getBlogPostsFromStorage,
  addBlogPostToStorage,
  updateBlogPostInStorage,
  deleteBlogPostFromStorage,
  getBlogPostByIdFromStorage,
  getBlogPostBySlugFromStorage
} from '@/lib/blog-storage';
import { BlogPost } from '@/types';

// GET - Get all blog posts
export async function GET() {
  try {
    const posts = await getBlogPostsFromStorage();
    return NextResponse.json({
      success: true,
      posts: posts
    });
  } catch (error) {
    console.error('Error fetching blog posts:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch blog posts' },
      { status: 500 }
    );
  }
}

// POST - Create new blog post
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, slug, excerpt, content, tags, author, status } = body;
    
    if (!title || !slug || !excerpt || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingPost = await getBlogPostBySlugFromStorage(slug);
    if (existingPost) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Generate new ID
    const allPosts = await getBlogPostsFromStorage();
    const newId = allPosts.length > 0
      ? (Math.max(...allPosts.map(p => parseInt(p.id) || 0)) + 1).toString()
      : '1';
    
    // Create new blog post
    const newPost: BlogPost = {
      id: newId,
      title,
      slug,
      excerpt,
      body: content,
      cover: body.cover || '/images/blog/default-cover.jpg',
      tags: tags || [],
      status: status || 'draft',
      author: {
        name: author || 'Tim MarkasAI',
        avatar: '/images/team/markasai-team.jpg',
        bio: 'Tim ahli AI dan digital marketing di MarkasAI'
      },
      publishedAt: new Date().toISOString().split('T')[0],
      readTime: Math.max(1, Math.ceil((content || '').split(' ').length / 200)), // Estimate reading time
      seo: {
        title: body.seoTitle || title,
        description: body.seoDescription || excerpt,
        keywords: body.seoKeywords || tags || []
      }
    };

    // Add to blog posts data
    await addBlogPostToStorage(newPost);

    return NextResponse.json({
      success: true,
      message: 'Blog post created successfully',
      post: newPost
    });

  } catch (error) {
    console.error('Error creating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create blog post' },
      { status: 500 }
    );
  }
}

// PUT - Update existing blog post
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, slug, excerpt, content, tags, author, status } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Find existing post
    const existingPost = await getBlogPostByIdFromStorage(id);
    if (!existingPost) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Check if new slug conflicts with other posts
    if (slug) {
      const conflictingPost = await getBlogPostBySlugFromStorage(slug);
      if (conflictingPost && conflictingPost.id !== id) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update post
    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(excerpt && { excerpt }),
      ...(content && { body: content }),
      ...(tags && { tags }),
      ...(author && { author: { ...existingPost.author, name: author } }),
      ...(status && { status }),
      ...(body.cover && { cover: body.cover }),
      ...(content && { readTime: Math.max(1, Math.ceil((content || '').split(' ').length / 200)) }),
      seo: {
        ...existingPost.seo,
        ...(body.seoTitle && { title: body.seoTitle }),
        ...(body.seoDescription && { description: body.seoDescription }),
        ...(body.seoKeywords && { keywords: body.seoKeywords })
      }
    };

    const updatedPost = await updateBlogPostInStorage(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Blog post updated successfully',
      post: updatedPost
    });

  } catch (error) {
    console.error('Error updating blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update blog post' },
      { status: 500 }
    );
  }
}

// DELETE - Delete blog post
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Post ID is required' },
        { status: 400 }
      );
    }

    // Find and delete post
    const postToDelete = await getBlogPostByIdFromStorage(id);
    if (!postToDelete) {
      return NextResponse.json(
        { success: false, error: 'Post not found' },
        { status: 404 }
      );
    }

    // Remove post
    const success = await deleteBlogPostFromStorage(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete post' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Blog post deleted successfully',
      post: postToDelete
    });

  } catch (error) {
    console.error('Error deleting blog post:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete blog post' },
      { status: 500 }
    );
  }
}

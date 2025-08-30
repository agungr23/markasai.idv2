import { NextRequest, NextResponse } from 'next/server';
import {
  getCaseStudies,
  addCaseStudy,
  updateCaseStudy,
  deleteCaseStudy,
  getCaseStudyById,
  getCaseStudyBySlug
} from '@/lib/storage-json-only';
import { CaseStudy } from '@/types';

// GET - Get all case studies
export async function GET() {
  try {
    const caseStudies = await getCaseStudies();
    return NextResponse.json({
      success: true,
      caseStudies: caseStudies
    });
  } catch (error) {
    console.error('Error fetching case studies:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to fetch case studies' },
      { status: 500 }
    );
  }
}

// POST - Create new case study
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    
    // Validate required fields
    const { title, slug, summary, client, industry, body: content, metrics } = body;
    
    if (!title || !slug || !summary || !client || !industry || !content) {
      return NextResponse.json(
        { success: false, error: 'Missing required fields' },
        { status: 400 }
      );
    }

    // Check if slug already exists
    const existingCaseStudy = await getCaseStudyBySlug(slug);
    if (existingCaseStudy) {
      return NextResponse.json(
        { success: false, error: 'Slug already exists' },
        { status: 400 }
      );
    }

    // Generate new ID
    const allCaseStudies = await getCaseStudies();
    const newId = allCaseStudies.length > 0
      ? (Math.max(...allCaseStudies.map(cs => parseInt(cs.id) || 0)) + 1).toString()
      : '1';
    
    // Create new case study
    const newCaseStudy: CaseStudy = {
      id: newId,
      title,
      slug,
      summary,
      client,
      industry,
      body: content,
      logo: body.logo || '/images/case-studies/default-logo.png',
      metrics: metrics || [],
      publishedAt: new Date().toISOString().split('T')[0],
      status: 'draft',
      seo: {
        title: body.seoTitle || title,
        description: body.seoDescription || summary,
        keywords: body.seoKeywords || []
      }
    };

    // Add to case studies data
    await addCaseStudy(newCaseStudy);

    return NextResponse.json({
      success: true,
      message: 'Case study created successfully',
      caseStudy: newCaseStudy
    });

  } catch (error) {
    console.error('Error creating case study:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to create case study' },
      { status: 500 }
    );
  }
}

// PUT - Update existing case study
export async function PUT(request: NextRequest) {
  try {
    const body = await request.json();
    const { id, title, slug, summary, client, industry, body: content, metrics } = body;
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Case study ID is required' },
        { status: 400 }
      );
    }

    // Find existing case study
    const existingCaseStudy = await getCaseStudyById(id);
    if (!existingCaseStudy) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      );
    }

    // Check if new slug conflicts with other case studies
    if (slug) {
      const conflictingCaseStudy = await getCaseStudyBySlug(slug);
      if (conflictingCaseStudy && conflictingCaseStudy.id !== id) {
        return NextResponse.json(
          { success: false, error: 'Slug already exists' },
          { status: 400 }
        );
      }
    }

    // Update case study
    const updateData = {
      ...(title && { title }),
      ...(slug && { slug }),
      ...(summary && { summary }),
      ...(client && { client }),
      ...(industry && { industry }),
      ...(content && { body: content }),
      ...(metrics && { metrics }),
      ...(body.logo && { logo: body.logo }),
      seo: {
        ...existingCaseStudy.seo,
        ...(body.seoTitle && { title: body.seoTitle }),
        ...(body.seoDescription && { description: body.seoDescription }),
        ...(body.seoKeywords && { keywords: body.seoKeywords })
      }
    };

    const updatedCaseStudy = await updateCaseStudy(id, updateData);

    return NextResponse.json({
      success: true,
      message: 'Case study updated successfully',
      caseStudy: updatedCaseStudy
    });

  } catch (error) {
    console.error('Error updating case study:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to update case study' },
      { status: 500 }
    );
  }
}

// DELETE - Delete case study
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');
    
    if (!id) {
      return NextResponse.json(
        { success: false, error: 'Case study ID is required' },
        { status: 400 }
      );
    }

    // Find and delete case study
    const caseStudyToDelete = await getCaseStudyById(id);
    if (!caseStudyToDelete) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      );
    }

    // Remove case study
    const success = await deleteCaseStudy(id);
    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Failed to delete case study' },
        { status: 500 }
      );
    }

    return NextResponse.json({
      success: true,
      message: 'Case study deleted successfully'
    });

  } catch (error) {
    console.error('Error deleting case study:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to delete case study' },
      { status: 500 }
    );
  }
}

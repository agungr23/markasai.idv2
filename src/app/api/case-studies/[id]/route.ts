import { NextRequest, NextResponse } from 'next/server';
import {
  getCaseStudyById,
  updateCaseStudy,
  deleteCaseStudy
} from '@/lib/storage-json-only';

interface RouteParams {
  params: Promise<{ id: string }>;
}

// GET - Get case study by ID
export async function GET(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const caseStudy = await getCaseStudyById(id);

    if (!caseStudy) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      );
    }

    return NextResponse.json({
      success: true,
      caseStudy: caseStudy
    });
  } catch (error) {
    console.error('Error reading case study:', error);
    return NextResponse.json(
      { success: false, error: 'Failed to read case study' },
      { status: 500 }
    );
  }
}

// PUT - Update case study by ID
export async function PUT(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;
    const body = await request.json();

    const updatedCaseStudy = await updateCaseStudy(id, body);

    if (!updatedCaseStudy) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
      );
    }

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

// DELETE - Delete case study by ID
export async function DELETE(request: NextRequest, { params }: RouteParams) {
  try {
    const { id } = await params;

    const success = await deleteCaseStudy(id);

    if (!success) {
      return NextResponse.json(
        { success: false, error: 'Case study not found' },
        { status: 404 }
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

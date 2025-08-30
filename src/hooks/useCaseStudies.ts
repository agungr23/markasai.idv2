'use client';

import { useState, useEffect } from 'react';
import { CaseStudy } from '@/types';

export function useCaseStudies() {
  const [caseStudies, setCaseStudies] = useState<CaseStudy[]>([]);
  const [loading, setLoading] = useState(true);

  // Fetch case studies from API
  const fetchCaseStudies = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/case-studies');
      const data = await response.json();
      
      if (data.success) {
        setCaseStudies(data.caseStudies);
      } else {
        console.error('Failed to fetch case studies:', data.error);
      }
    } catch (error) {
      console.error('Error fetching case studies:', error);
    } finally {
      setLoading(false);
    }
  };

  // Load case studies on mount
  useEffect(() => {
    fetchCaseStudies();
  }, []);

  // Get case study by ID
  const getCaseStudyById = (id: string): CaseStudy | undefined => {
    return caseStudies.find(cs => cs.id === id);
  };

  // Get case study by slug
  const getCaseStudyBySlug = (slug: string): CaseStudy | undefined => {
    return caseStudies.find(cs => cs.slug === slug);
  };

  // Add new case study
  const addCaseStudy = async (caseStudyData: Omit<CaseStudy, 'id' | 'publishedAt'>) => {
    try {
      const response = await fetch('/api/case-studies', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseStudyData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh case studies list
        await fetchCaseStudies();
        return result.caseStudy;
      } else {
        throw new Error(result.error || 'Failed to create case study');
      }
    } catch (error) {
      console.error('Error creating case study:', error);
      throw error;
    }
  };

  // Update case study
  const updateCaseStudy = async (id: string, caseStudyData: Partial<CaseStudy>) => {
    try {
      const response = await fetch(`/api/case-studies/${id}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(caseStudyData),
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh case studies list
        await fetchCaseStudies();
        return result.caseStudy;
      } else {
        throw new Error(result.error || 'Failed to update case study');
      }
    } catch (error) {
      console.error('Error updating case study:', error);
      throw error;
    }
  };

  // Delete case study
  const deleteCaseStudy = async (id: string) => {
    try {
      const response = await fetch(`/api/case-studies/${id}`, {
        method: 'DELETE',
      });

      const result = await response.json();
      
      if (result.success) {
        // Refresh case studies list
        await fetchCaseStudies();
      } else {
        throw new Error(result.error || 'Failed to delete case study');
      }
    } catch (error) {
      console.error('Error deleting case study:', error);
      throw error;
    }
  };

  // Search case studies
  const searchCaseStudies = (query: string) => {
    const lowercaseQuery = query.toLowerCase();
    return caseStudies.filter(cs =>
      cs.title.toLowerCase().includes(lowercaseQuery) ||
      cs.summary.toLowerCase().includes(lowercaseQuery) ||
      cs.client.toLowerCase().includes(lowercaseQuery) ||
      cs.industry.toLowerCase().includes(lowercaseQuery)
    );
  };

  // Filter by industry
  const getCaseStudiesByIndustry = (industry: string) => {
    return caseStudies.filter(cs => cs.industry === industry);
  };

  // Get all industries
  const getIndustries = () => {
    const industries = [...new Set(caseStudies.map(cs => cs.industry))];
    return industries.sort();
  };

  return {
    caseStudies,
    loading,
    getCaseStudyById,
    getCaseStudyBySlug,
    addCaseStudy,
    updateCaseStudy,
    deleteCaseStudy,
    searchCaseStudies,
    getCaseStudiesByIndustry,
    getIndustries,
    fetchCaseStudies
  };
}

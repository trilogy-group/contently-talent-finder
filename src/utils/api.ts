import { ContentPlan, ContentPillar, SeoKeyword } from "@/types/content";

const API_BASE_URL = 'https://kzpzktx2u9.execute-api.us-east-1.amazonaws.com/prod';

export const contentStrategyApi = {
  async getOverview(publicationId?: string) {
    const id = publicationId || '1230';
    const response = await fetch(`${API_BASE_URL}/content-strategy/${id}`);
    if (!response.ok) throw new Error('Failed to fetch overview');
    return response.json();
  },

  async getMissionAndGoals(publicationId?: string) {
    const id = publicationId || '1230';
    const response = await fetch(`${API_BASE_URL}/content-strategy/${id}/mission-and-goals`);
    if (!response.ok) throw new Error('Failed to fetch mission and goals');
    return response.json();
  },

  async updateMissionAndGoals(data: any, publicationId?: string) {
    const id = publicationId || '1230';
    const response = await fetch(`${API_BASE_URL}/content-strategy/${id}/mission-and-goals`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update mission and goals');
    return response.json();
  },

  // Voice and Style endpoints
  async getVoiceAndStyle(publicationId?: string) {
    const id = publicationId || '1230';
    const response = await fetch(`${API_BASE_URL}/content-strategy/${id}/voice-and-styles`);
    if (!response.ok) throw new Error('Failed to fetch voice and styles');
    return response.json();
  },

  async updateVoiceAndStyle(data: any, publicationId?: string) {
    const id = publicationId || '1230';
    const response = await fetch(`${API_BASE_URL}/content-strategy/${id}/voice-and-styles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update voice and styles');
    return response.json();
  },

  // Audiences endpoints
  async getAudiences(publicationId?: string) {
    const id = publicationId || '1230';
    const response = await fetch(`${API_BASE_URL}/content-strategy/${id}/audiences`);
    if (!response.ok) throw new Error('Failed to fetch audiences');
    return response.json();
  },

  async createAudience(data: any, publicationId?: string) {
    const id = publicationId || '1230';
    const response = await fetch(`${API_BASE_URL}/content-strategy/${id}/audiences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create audience');
    return response.json();
  },

  async updateAudience(id: string, data: any, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/audiences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update audience');
    return response.json();
  },

  async deleteAudience(id: string, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/audiences/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete audience');
    return response.json();
  },

  // Content Pillars endpoints
  async getPillars(publicationId?: string) {
    const url = publicationId 
      ? `${API_BASE_URL}/content-strategy/${publicationId}/pillars`
      : `${API_BASE_URL}/content-strategy/1230/pillars`;
      
    const response = await fetch(url);
    if (!response.ok) throw new Error('Failed to fetch pillars');
    return response.json();
  },

  async updatePillars(pillars: ContentPillar[], publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/pillars`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pillars)
    });
    if (!response.ok) throw new Error('Failed to update pillars');
    return response.json();
  },

  // Pillar endpoints
  async createPillar(pillar: Omit<ContentPillar, 'id'>, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/pillars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pillar)
    });
    if (!response.ok) throw new Error('Failed to create pillar');
    return response.json();
  },

  async updatePillar(id: string, pillar: ContentPillar, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/pillars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pillar)
    });
    if (!response.ok) throw new Error('Failed to update pillar');
    return response.json();
  },

  async deletePillar(id: string, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/pillars/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete pillar');
    return response.json();
  },

  // Content Plans endpoints
  async getPlans(publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/plans`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  },

  async updatePlans(plans: ContentPlan[], publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/plans`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plans)
    });
    if (!response.ok) throw new Error('Failed to update plans');
    return response.json();
  },

  // Distribution endpoints
  async getDistribution(publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/distribution`);
    if (!response.ok) throw new Error('Failed to fetch distribution');
    return response.json();
  },

  async updateDistribution(data: any, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/distribution`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update distribution');
    return response.json();
  },

  // SEO Keywords endpoints
  async getSeoKeywords(publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/seo-keywords`);
    if (!response.ok) throw new Error('Failed to fetch SEO keywords');
    return response.json();
  },

  async createSeoKeyword(keyword: Omit<SeoKeyword, 'id'>, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/seo-keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keyword)
    });
    if (!response.ok) throw new Error('Failed to create SEO keyword');
    return response.json();
  },

  async deleteSeoKeyword(id: string, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/seo-keywords/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete SEO keyword');
    return response.json();
  },

  // Content Plan endpoints
  async getPlan(publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/plans`);
    if (!response.ok) throw new Error('Failed to fetch plan');
    return response.json();
  },

  async updatePlan(plan: any, publicationId?: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${publicationId || '1230'}/plans/${plan.pillar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!response.ok) throw new Error('Failed to update plan');
    return response.json();
  },

  // Add this new method to contentStrategyApi
  async getPublications() {
    const response = await fetch('https://9w2hge8i7d.execute-api.us-east-1.amazonaws.com/prod/options');
    if (!response.ok) throw new Error('Failed to fetch publications');
    return response.json();
  }
}; 
import { ContentPlan, ContentPillar, SeoKeyword } from "@/types/content";

const API_BASE_URL = 'https://l0l4yto6u1.execute-api.us-east-1.amazonaws.com/prod';
const PUBLICATION_ID = '3088';

export const contentStrategyApi = {
  async getOverview() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}`);
    if (!response.ok) throw new Error('Failed to fetch overview');
    return response.json();
  },

  async getMissionAndGoals() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/mission-and-goals`);
    if (!response.ok) throw new Error('Failed to fetch mission and goals');
    return response.json();
  },

  async updateMissionAndGoals(data: any) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/mission-and-goals`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update mission and goals');
    return response.json();
  },

  // Voice and Style endpoints
  async getVoiceAndStyle() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/voice-and-styles`);
    if (!response.ok) throw new Error('Failed to fetch voice and styles');
    return response.json();
  },

  async updateVoiceAndStyle(data: any) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/voice-and-styles`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update voice and styles');
    return response.json();
  },

  // Audiences endpoints
  async getAudiences() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/audiences`);
    if (!response.ok) throw new Error('Failed to fetch audiences');
    return response.json();
  },

  async createAudience(data: any) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/audiences`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to create audience');
    return response.json();
  },

  async updateAudience(id: string, data: any) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/audiences/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update audience');
    return response.json();
  },

  async deleteAudience(id: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/audiences/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete audience');
    return response.json();
  },

  // Content Pillars endpoints
  async getPillars() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/pillars`);
    if (!response.ok) throw new Error('Failed to fetch pillars');
    return response.json();
  },

  async updatePillars(pillars: ContentPillar[]) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/pillars`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pillars)
    });
    if (!response.ok) throw new Error('Failed to update pillars');
    return response.json();
  },

  // Pillar endpoints
  async createPillar(pillar: Omit<ContentPillar, 'id'>) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/pillars`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pillar)
    });
    if (!response.ok) throw new Error('Failed to create pillar');
    return response.json();
  },

  async updatePillar(id: string, pillar: ContentPillar) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/pillars/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(pillar)
    });
    if (!response.ok) throw new Error('Failed to update pillar');
    return response.json();
  },

  async deletePillar(id: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/pillars/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete pillar');
    return response.json();
  },

  // Content Plans endpoints
  async getPlans() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/plans`);
    if (!response.ok) throw new Error('Failed to fetch plans');
    return response.json();
  },

  async updatePlans(plans: ContentPlan[]) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/plans`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plans)
    });
    if (!response.ok) throw new Error('Failed to update plans');
    return response.json();
  },

  // Distribution endpoints
  async getDistribution() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/distribution`);
    if (!response.ok) throw new Error('Failed to fetch distribution');
    return response.json();
  },

  async updateDistribution(data: any) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/distribution`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data)
    });
    if (!response.ok) throw new Error('Failed to update distribution');
    return response.json();
  },

  // SEO Keywords endpoints
  async getSeoKeywords() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/seo-keywords`);
    if (!response.ok) throw new Error('Failed to fetch SEO keywords');
    return response.json();
  },

  async createSeoKeyword(keyword: Omit<SeoKeyword, 'id'>) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/seo-keywords`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(keyword)
    });
    if (!response.ok) throw new Error('Failed to create SEO keyword');
    return response.json();
  },

  async deleteSeoKeyword(id: string) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/seo-keywords/${id}`, {
      method: 'DELETE'
    });
    if (!response.ok) throw new Error('Failed to delete SEO keyword');
    return response.json();
  },

  // Content Plan endpoints
  async getPlan() {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/plans`);
    if (!response.ok) throw new Error('Failed to fetch plan');
    return response.json();
  },

  async updatePlan(plan: any) {
    const response = await fetch(`${API_BASE_URL}/content-strategy/${PUBLICATION_ID}/plans/${plan.pillar.id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(plan)
    });
    if (!response.ok) throw new Error('Failed to update plan');
    return response.json();
  }
}; 
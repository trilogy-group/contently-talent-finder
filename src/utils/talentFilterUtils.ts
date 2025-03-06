import { TalentProfile } from "@/types/talent-search";

export const filterTalentProfiles = (
  profiles: TalentProfile[],
  {
    searchTerm = "",
    selectedIndustries = [],
    selectedSpecialties = [],
    selectedSkills = [],
    minExperience = null,
    minScore = null,
    minProjects = null,
    starredProfiles = [],
    showStarredOnly = false,
  }: {
    searchTerm?: string;
    selectedIndustries?: string[];
    selectedSpecialties?: string[];
    selectedSkills?: string[];
    minExperience?: number | null;
    minScore?: number | null;
    minProjects?: number | null;
    starredProfiles?: number[];
    showStarredOnly?: boolean;
  }
) => {
  return profiles.filter(profile => {
    // Starred filter
    if (showStarredOnly && !starredProfiles.includes(profile.id)) {
      return false;
    }
    
    // Search term filter
    const matchesSearch = searchTerm === "" || 
      profile.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.bio.toLowerCase().includes(searchTerm.toLowerCase()) ||
      profile.skills.some(skill => skill.toLowerCase().includes(searchTerm.toLowerCase()));
    
    // Industry filter
    const matchesIndustry = selectedIndustries.length === 0 || 
      profile.industries.some(industry => selectedIndustries.includes(industry));
    
    // Specialty filter
    const matchesSpecialty = selectedSpecialties.length === 0 || 
      profile.specialties.some(specialty => selectedSpecialties.includes(specialty));
    
    // Skills filter
    const matchesSkills = selectedSkills.length === 0 || 
      profile.skills.some(skill => selectedSkills.includes(skill));
    
    // Experience filter
    const matchesExperience = minExperience === null || 
      profile.experience >= minExperience;
    
    // Score filter
    const matchesScore = minScore === null || 
      (profile.score !== undefined && profile.score >= minScore);
    
    // Projects filter
    const matchesProjects = minProjects === null || 
      (profile.projects !== undefined && profile.projects.length >= minProjects);
    
    return matchesSearch && matchesIndustry && matchesSpecialty && 
           matchesSkills && matchesExperience && matchesScore && matchesProjects;
  });
};

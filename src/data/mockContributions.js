// Generate mock contribution data for the last year
export const generateContributionData = () => {
  const data = [];
  const today = new Date();
  const startDate = new Date(today);
  startDate.setFullYear(today.getFullYear() - 1);
  
  let currentDate = new Date(startDate);
  
  while (currentDate <= today) {
    const dayOfWeek = currentDate.getDay();
    const month = currentDate.getMonth();
    const date = currentDate.getDate();
    
    // Generate random activity (0-4 levels)
    // More activity on weekdays, less on weekends
    const isWeekend = dayOfWeek === 0 || dayOfWeek === 6;
    const activityLevel = isWeekend 
      ? Math.floor(Math.random() * 3) 
      : Math.floor(Math.random() * 5);
    
    data.push({
      date: new Date(currentDate),
      level: activityLevel,
      count: activityLevel * 3, // Convert to actual count
    });
    
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  return data;
};

export const contributionData = generateContributionData();

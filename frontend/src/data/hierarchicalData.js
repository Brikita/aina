export const generateHierarchicalData = () => {
  const counties = [
    { id: 'county_1', name: 'Turkana', level: 'county', parent_id: null },
    { id: 'county_2', name: 'Marsabit', level: 'county', parent_id: null },
    { id: 'county_3', name: 'Nairobi', level: 'county', parent_id: null },
    { id: 'county_4', name: 'Kisumu', level: 'county', parent_id: null },
    { id: 'county_5', name: 'Mombasa', level: 'county', parent_id: null },
  ];
  
  const subCounties = [
    { id: 'sub_1_1', name: 'Turkana North', level: 'subcounty', parent_id: 'county_1' },
    { id: 'sub_1_2', name: 'Turkana Central', level: 'subcounty', parent_id: 'county_1' },
    { id: 'sub_1_3', name: 'Turkana South', level: 'subcounty', parent_id: 'county_1' },
    { id: 'sub_2_1', name: 'Marsabit Central', level: 'subcounty', parent_id: 'county_2' },
    { id: 'sub_2_2', name: 'Marsabit North', level: 'subcounty', parent_id: 'county_2' },
    { id: 'sub_3_1', name: 'Nairobi Central', level: 'subcounty', parent_id: 'county_3' },
  ];
  
  const wards = [
    { id: 'ward_1_1_1', name: 'Kakuma', level: 'ward', parent_id: 'sub_1_1' },
    { id: 'ward_1_1_2', name: 'Lodwar', level: 'ward', parent_id: 'sub_1_1' },
    { id: 'ward_1_2_1', name: 'Lokitaung', level: 'ward', parent_id: 'sub_1_2' },
    { id: 'ward_2_1_1', name: 'Moyale', level: 'ward', parent_id: 'sub_2_1' },
    { id: 'ward_2_1_2', name: 'Turbi', level: 'ward', parent_id: 'sub_2_1' },
    { id: 'ward_3_1_1', name: 'Kibera', level: 'ward', parent_id: 'sub_3_1' },
    { id: 'ward_3_1_2', name: 'Westlands', level: 'ward', parent_id: 'sub_3_1' },
  ];
  
  const villages = [
    { id: 'village_1_1_1_1', name: 'Nakururum', level: 'village', parent_id: 'ward_1_1_1' },
    { id: 'village_1_1_1_2', name: 'Kibish', level: 'village', parent_id: 'ward_1_1_1' },
    { id: 'village_1_1_2_1', name: 'Lodwar Town', level: 'village', parent_id: 'ward_1_1_2' },
    { id: 'village_2_1_1_1', name: 'Gatab', level: 'village', parent_id: 'ward_2_1_1' },
    { id: 'village_2_1_1_2', name: 'Kalacha', level: 'village', parent_id: 'ward_2_1_1' },
    { id: 'village_3_1_1_1', name: 'Kibera South', level: 'village', parent_id: 'ward_3_1_1' },
  ];
  
  return { counties, subCounties, wards, villages };
};

export const buildTree = (data) => {
  const { counties, subCounties, wards, villages } = data;
  
  return counties.map(county => ({
    ...county,
    children: subCounties
      .filter(sub => sub.parent_id === county.id)
      .map(sub => ({
        ...sub,
        children: wards
          .filter(ward => ward.parent_id === sub.id)
          .map(ward => ({
            ...ward,
            children: villages
              .filter(village => village.parent_id === ward.id)
              .map(village => ({
                ...village,
                children: [],
                isLeaf: true
              })),
            isLeaf: false
          })),
        isLeaf: false
      })),
    isLeaf: false
  }));
};
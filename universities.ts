export interface University {
  id: string;
  name: string;
  location: string;
  country: string;
  rating: number;
  reviewCount: number;
  type: string;
  ranking: number;
  preview: string;
  logo: string;
  popularity: number;
  studentCount: number;
  foundedYear: number;
  acceptanceRate: number;
  tuitionFee: string;
  description: string;
  heroImage: string;
  stats: {
    academics: number;
    campus: number;
    career: number;
    social: number;
    value: number;
  };
}

export const universities: University[] = [
  {
    id: 'harvard',
    name: 'Harvard University',
    location: 'Cambridge, MA',
    country: 'US',
    rating: 4.8,
    reviewCount: 1250,
    type: 'Private',
    ranking: 1,
    preview: 'World-renowned institution with exceptional academic programs and research opportunities.',
    logo: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    popularity: 95,
    studentCount: 23000,
    foundedYear: 1636,
    acceptanceRate: 3.4,
    tuitionFee: '$54,002',
    description: 'Harvard University is a private Ivy League research university in Cambridge, Massachusetts. Established in 1636, Harvard is the oldest institution of higher education in the United States and among the most prestigious in the world.',
    heroImage: 'https://images.pexels.com/photos/207692/pexels-photo-207692.jpeg?auto=compress&cs=tinysrgb&w=1200&h=240&fit=crop',
    stats: {
      academics: 4.9,
      campus: 4.6,
      career: 4.8,
      social: 4.2,
      value: 4.1
    }
  },
  {
    id: 'stanford',
    name: 'Stanford University',
    location: 'Stanford, CA',
    country: 'US',
    rating: 4.7,
    reviewCount: 980,
    type: 'Private',
    ranking: 2,
    preview: 'Leading innovation hub with strong entrepreneurship culture and cutting-edge technology programs.',
    logo: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    popularity: 92,
    studentCount: 17000,
    foundedYear: 1885,
    acceptanceRate: 4.3,
    tuitionFee: '$56,169',
    description: 'Stanford University is a private research university in Stanford, California. Known for its academic strength, wealth, proximity to Silicon Valley, and ranking as one of the world\'s top universities.',
    heroImage: 'https://images.pexels.com/photos/1438072/pexels-photo-1438072.jpeg?auto=compress&cs=tinysrgb&w=1200&h=240&fit=crop',
    stats: {
      academics: 4.8,
      campus: 4.7,
      career: 4.9,
      social: 4.3,
      value: 4.2
    }
  },
  {
    id: 'mit',
    name: 'Massachusetts Institute of Technology',
    location: 'Cambridge, MA',
    country: 'US',
    rating: 4.9,
    reviewCount: 1100,
    type: 'Private',
    ranking: 3,
    preview: 'Premier institution for science, technology, engineering, and mathematics education.',
    logo: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    popularity: 88,
    studentCount: 11520,
    foundedYear: 1861,
    acceptanceRate: 6.7,
    tuitionFee: '$53,790',
    description: 'The Massachusetts Institute of Technology is a private land-grant research university in Cambridge, Massachusetts. Established in 1861, MIT has since played a key role in the development of modern technology and science.',
    heroImage: 'https://images.pexels.com/photos/159711/books-bookstore-book-reading-159711.jpeg?auto=compress&cs=tinysrgb&w=1200&h=240&fit=crop',
    stats: {
      academics: 5.0,
      campus: 4.4,
      career: 4.9,
      social: 4.0,
      value: 4.3
    }
  },
  {
    id: 'oxford',
    name: 'University of Oxford',
    location: 'Oxford',
    country: 'UK',
    rating: 4.6,
    reviewCount: 850,
    type: 'Public',
    ranking: 4,
    preview: 'Historic university with centuries of academic excellence and distinguished alumni.',
    logo: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    popularity: 85,
    studentCount: 24000,
    foundedYear: 1096,
    acceptanceRate: 17.5,
    tuitionFee: '£9,250',
    description: 'The University of Oxford is a collegiate research university in Oxford, England. There is evidence of teaching as early as 1096, making it the oldest university in the English-speaking world.',
    heroImage: 'https://images.pexels.com/photos/1181345/pexels-photo-1181345.jpeg?auto=compress&cs=tinysrgb&w=1200&h=240&fit=crop',
    stats: {
      academics: 4.8,
      campus: 4.9,
      career: 4.6,
      social: 4.4,
      value: 4.5
    }
  },
  {
    id: 'cambridge',
    name: 'University of Cambridge',
    location: 'Cambridge',
    country: 'UK',
    rating: 4.7,
    reviewCount: 920,
    type: 'Public',
    ranking: 5,
    preview: 'World-class research university with outstanding academic reputation and traditions.',
    logo: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    popularity: 87,
    studentCount: 23000,
    foundedYear: 1209,
    acceptanceRate: 21.0,
    tuitionFee: '£9,250',
    description: 'The University of Cambridge is a collegiate research university in Cambridge, United Kingdom. Founded in 1209 and granted a royal charter by Henry III in 1231, Cambridge is the second-oldest university in the English-speaking world.',
    heroImage: 'https://images.pexels.com/photos/1181533/pexels-photo-1181533.jpeg?auto=compress&cs=tinysrgb&w=1200&h=240&fit=crop',
    stats: {
      academics: 4.9,
      campus: 4.8,
      career: 4.7,
      social: 4.3,
      value: 4.4
    }
  },
  {
    id: 'toronto',
    name: 'University of Toronto',
    location: 'Toronto, ON',
    country: 'CA',
    rating: 4.4,
    reviewCount: 750,
    type: 'Public',
    ranking: 18,
    preview: 'Canada\'s leading research university with diverse programs and multicultural environment.',
    logo: 'https://images.pexels.com/photos/1181712/pexels-photo-1181712.jpeg?auto=compress&cs=tinysrgb&w=200&h=200&fit=crop',
    popularity: 78,
    studentCount: 97000,
    foundedYear: 1827,
    acceptanceRate: 43.0,
    tuitionFee: 'CAD $58,160',
    description: 'The University of Toronto is a public research university in Toronto, Ontario, Canada, located on the grounds that surround Queen\'s Park. It was founded by royal charter in 1827 as King\'s College.',
    heroImage: 'https://images.pexels.com/photos/1181712/pexels-photo-1181712.jpeg?auto=compress&cs=tinysrgb&w=1200&h=240&fit=crop',
    stats: {
      academics: 4.6,
      campus: 4.2,
      career: 4.4,
      social: 4.1,
      value: 4.3
    }
  }
];

export const getUniversityById = (id: string): University | undefined => {
  return universities.find(uni => uni.id === id);
};

export const getUniversityByName = (name: string): University | undefined => {
  return universities.find(uni => uni.name.toLowerCase() === name.toLowerCase());
};
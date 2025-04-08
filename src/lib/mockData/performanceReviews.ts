import { PerformanceReview, ReviewCategory } from '../../types';


export const performanceReviews: PerformanceReview[] = [
  {
    id: 'pr1',
    employeeId: '3', // John Smith
    employeeName: 'John Smith',
    reviewerId: '2', // HR Manager
    reviewerName: 'HR Manager',
    reviewPeriod: 'Q4 2023',
    reviewDate: '2023-12-15',
    status: 'completed',
    categories: [
      {
        name: 'Technical Skills',
        rating: 4, // 1-5 scale
        comments: 'Strong technical skills. Consistently delivers quality code.'
      },
      {
        name: 'Communication',
        rating: 3,
        comments: 'Communicates well with team members but could improve client communications.'
      },
      {
        name: 'Leadership',
        rating: 3,
        comments: 'Shows potential for leadership. Has mentored junior developers.'
      },
      {
        name: 'Initiative',
        rating: 4,
        comments: 'Takes initiative to solve problems and improve processes.'
      },
      {
        name: 'Reliability',
        rating: 4,
        comments: 'Consistently meets deadlines and delivers on commitments.'
      }
    ],
    overallRating: 3.6,
    strengths: 'Technical expertise, problem-solving, and initiative.',
    areasForImprovement: 'Client communication and documentation practices.',
    goals: [
      'Improve client-facing communication skills',
      'Lead a project team by Q2 2024',
      'Learn a new programming language or framework'
    ],
    employeeComments: 'I agree with the assessment and am committed to improving my client communication skills.',
    employeeAcknowledgement: {
      acknowledged: true,
      date: '2023-12-16'
    },
    attachments: []
  },
  {
    id: 'pr2',
    employeeId: '4', // Jane Doe
    employeeName: 'Jane Doe',
    reviewerId: '2', // HR Manager
    reviewerName: 'HR Manager',
    reviewPeriod: 'Q4 2023',
    reviewDate: '2023-12-14',
    status: 'completed',
    categories: [
      {
        name: 'Marketing Strategy',
        rating: 5,
        comments: 'Exceptional strategic thinking and campaign planning.'
      },
      {
        name: 'Communication',
        rating: 4,
        comments: 'Excellent communication with clients and team members.'
      },
      {
        name: 'Creativity',
        rating: 5,
        comments: 'Consistently brings innovative ideas to campaigns.'
      },
      {
        name: 'Execution',
        rating: 4,
        comments: 'Executes marketing plans effectively and on schedule.'
      },
      {
        name: 'Analytics',
        rating: 3,
        comments: 'Good understanding of marketing analytics but could improve data interpretation.'
      }
    ],
    overallRating: 4.2,
    strengths: 'Strategic planning, creativity, and client communication.',
    areasForImprovement: 'Data analysis skills and campaign ROI assessment.',
    goals: [
      'Complete advanced marketing analytics certification',
      'Lead the rebranding project for key client',
      'Mentor junior marketing team members'
    ],
    employeeComments: 'Thank you for the feedback. I will focus on improving my analytics skills.',
    employeeAcknowledgement: {
      acknowledged: true,
      date: '2023-12-15'
    },
    attachments: []
  },
  {
    id: 'pr3',
    employeeId: '5', // Bob Johnson
    employeeName: 'Bob Johnson',
    reviewerId: '2', // HR Manager
    reviewerName: 'HR Manager',
    reviewPeriod: 'Q4 2023',
    reviewDate: '2023-12-18',
    status: 'pending_employee',
    categories: [
      {
        name: 'Financial Analysis',
        rating: 4,
        comments: 'Strong analytical skills and financial modeling.'
      },
      {
        name: 'Reporting',
        rating: 4,
        comments: 'Delivers clear and accurate financial reports.'
      },
      {
        name: 'Compliance',
        rating: 5,
        comments: 'Excellent understanding of financial regulations and compliance.'
      },
      {
        name: 'Problem Solving',
        rating: 3,
        comments: 'Good problem-solving skills but sometimes needs guidance on complex issues.'
      },
      {
        name: 'Communication',
        rating: 3,
        comments: 'Communicates well with finance team but could improve cross-department communication.'
      }
    ],
    overallRating: 3.8,
    strengths: 'Financial analysis, compliance knowledge, and attention to detail.',
    areasForImprovement: 'Cross-departmental communication and complex problem-solving.',
    goals: [
      'Improve communication with non-finance departments',
      'Lead the implementation of new financial reporting system',
      'Obtain additional certification in financial analysis'
    ],
    employeeComments: null,
    employeeAcknowledgement: {
      acknowledged: false,
      date: null
    },
    attachments: []
  },
  {
    id: 'pr4',
    employeeId: '7', // Mike Peters
    employeeName: 'Mike Peters',
    reviewerId: '2', // HR Manager
    reviewerName: 'HR Manager',
    reviewPeriod: 'Q4 2023',
    reviewDate: '2023-12-12',
    status: 'completed',
    categories: [
      {
        name: 'Sales Performance',
        rating: 3,
        comments: 'Met most sales targets but missed some key opportunities.'
      },
      {
        name: 'Client Relationship',
        rating: 4,
        comments: 'Excellent at building and maintaining client relationships.'
      },
      {
        name: 'Product Knowledge',
        rating: 4,
        comments: 'Strong understanding of product offerings and features.'
      },
      {
        name: 'Negotiation Skills',
        rating: 3,
        comments: 'Good negotiation skills but could improve on closing high-value deals.'
      },
      {
        name: 'Teamwork',
        rating: 5,
        comments: 'Outstanding team player, always willing to help colleagues.'
      }
    ],
    overallRating: 3.8,
    strengths: 'Client relationships, product knowledge, and teamwork.',
    areasForImprovement: 'Sales targets achievement and closing high-value deals.',
    goals: [
      'Exceed quarterly sales targets for the next 2 quarters',
      'Develop strategies for targeting high-value clients',
      'Cross-sell additional services to existing clients'
    ],
    employeeComments: 'I appreciate the feedback and will focus on improving my performance in the areas mentioned.',
    employeeAcknowledgement: {
      acknowledged: true,
      date: '2023-12-13'
    },
    attachments: []
  },
  {
    id: 'pr5',
    employeeId: '6', // Sarah Williams
    employeeName: 'Sarah Williams',
    reviewerId: '3', // John Smith (her manager)
    reviewerName: 'John Smith',
    reviewPeriod: 'Q4 2023',
    reviewDate: '2023-12-10',
    status: 'pending_employee',
    categories: [
      {
        name: 'Testing Skills',
        rating: 5,
        comments: 'Exceptional testing methodology and thoroughness.'
      },
      {
        name: 'Bug Documentation',
        rating: 4,
        comments: 'Clear and detailed bug reports.'
      },
      {
        name: 'Automation',
        rating: 3,
        comments: 'Good progress in learning test automation but still developing skills.'
      },
      {
        name: 'Communication',
        rating: 4,
        comments: 'Communicates effectively with development team.'
      },
      {
        name: 'Problem Solving',
        rating: 4,
        comments: 'Strong problem-solving skills when debugging issues.'
      }
    ],
    overallRating: 4.0,
    strengths: 'Manual testing, bug documentation, and communication with developers.',
    areasForImprovement: 'Test automation skills and efficiency in regression testing.',
    goals: [
      'Complete advanced test automation certification',
      'Implement automated regression test suite for main product',
      'Mentor junior QA team members'
    ],
    employeeComments: null,
    employeeAcknowledgement: {
      acknowledged: false,
      date: null
    },
    attachments: []
  }
];

// Helper functions
export const getPerformanceReviewById = (id: string): PerformanceReview | undefined => {
  return performanceReviews.find(review => review.id === id);
};

export const getPerformanceReviewsByEmployee = (employeeId: string): PerformanceReview[] => {
  return performanceReviews.filter(review => review.employeeId === employeeId);
};

export const getPerformanceReviewsByStatus = (status: PerformanceReview['status']): PerformanceReview[] => {
  return performanceReviews.filter(review => review.status === status);
};

export const getPendingEmployeeAcknowledgements = (): PerformanceReview[] => {
  return performanceReviews.filter(review => 
    review.status === 'pending_employee' && !review.employeeAcknowledgement.acknowledged
  );
};

interface NewPerformanceReview {
  employeeId: string;
  employeeName: string;
  reviewerId: string;
  reviewerName: string;
  reviewPeriod: string;
  categories: ReviewCategory[];
  overallRating: number;
  strengths: string;
  areasForImprovement: string;
  goals: string[];
  [key: string]: any;
}

// Mock function to add a new performance review
export const addPerformanceReview = (newReview: NewPerformanceReview): PerformanceReview => {
  const review: PerformanceReview = {
    id: `pr${performanceReviews.length + 1}`,
    reviewDate: new Date().toISOString().split('T')[0],
    status: 'pending_employee',
    employeeComments: null,
    employeeAcknowledgement: {
      acknowledged: false,
      date: null
    },
    attachments: [],
    ...newReview
  };
  
  performanceReviews.push(review);
  return review;
};

interface PerformanceReviewUpdates {
  status?: PerformanceReview['status'];
  employeeComments?: string | null;
  employeeAcknowledgement?: {
    acknowledged: boolean;
    date: string | null;
  };
  [key: string]: any;
}

// Mock function to update a performance review
export const updatePerformanceReview = (id: string, updates: PerformanceReviewUpdates): PerformanceReview | null => {
  const index = performanceReviews.findIndex(review => review.id === id);
  if (index !== -1) {
    performanceReviews[index] = { ...performanceReviews[index], ...updates };
    return performanceReviews[index];
  }
  return null;
};

// Mock function to acknowledge a performance review
export const acknowledgePerformanceReview = (id: string, comments?: string): PerformanceReview | null => {
  const index = performanceReviews.findIndex(review => review.id === id);
  if (index !== -1) {
    performanceReviews[index].employeeComments = comments || '';
    performanceReviews[index].employeeAcknowledgement = {
      acknowledged: true,
      date: new Date().toISOString().split('T')[0]
    };
    performanceReviews[index].status = 'completed';
    return performanceReviews[index];
  }
  return null;
};
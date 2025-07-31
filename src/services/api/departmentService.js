// Mock department data
const mockDepartments = [
  {
    Id: 1,
    name: "Cardiology",
    color: "#EF4444", // red-500
    description: "Heart and cardiovascular care",
    head: "Dr. Smith",
    status: "active"
  },
  {
    Id: 2,
    name: "Neurology",
    color: "#8B5CF6", // violet-500
    description: "Brain and nervous system care",
    head: "Dr. Davis",
    status: "active"
  },
  {
    Id: 3,
    name: "Orthopedics",
    color: "#10B981", // emerald-500
    description: "Bone, joint, and muscle care",
    head: "Dr. Johnson",
    status: "active"
  },
  {
    Id: 4,
    name: "Pediatrics",
    color: "#F59E0B", // amber-500
    description: "Children's healthcare",
    head: "Dr. Williams",
    status: "active"
  },
  {
    Id: 5,
    name: "Dermatology",
    color: "#06B6D4", // cyan-500
    description: "Skin and hair care",
    head: "Dr. Brown",
    status: "active"
  },
  {
    Id: 6,
    name: "Psychiatry",
    color: "#EC4899", // pink-500
    description: "Mental health care",
    head: "Dr. Taylor",
    status: "active"
  }
];

class DepartmentService {
  constructor() {
    this.departments = [...mockDepartments];
  }

  async getAll() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return [...this.departments];
  }

  async getById(id) {
    await new Promise(resolve => setTimeout(resolve, 200));
    const department = this.departments.find(d => d.Id === parseInt(id));
    if (!department) {
      throw new Error("Department not found");
    }
    return { ...department };
  }

  async getActiveOnly() {
    await new Promise(resolve => setTimeout(resolve, 200));
    return this.departments.filter(d => d.status === "active").map(d => ({ ...d }));
  }
}

export default new DepartmentService();
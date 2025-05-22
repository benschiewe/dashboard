import { Usage } from "./schema"

export const roles: { value: string; label: string }[] = [
  {
    value: "admin",
    label: "Admin",
  },
  {
    value: "member",
    label: "Member",
  },
  {
    value: "viewer",
    label: "Viewer",
  },
  {
    value: "contributor",
    label: "Contributor",
  },
]

export const statuses: { value: string; label: string; variant: string }[] = [
  {
    value: "live",
    label: "Live",
    variant: "success",
  },
  {
    value: "inactive",
    label: "Inactive",
    variant: "neutral",
  },
  {
    value: "planned",
    label: "Planned",
    variant: "warning",
  },
]

export const regions: { value: string; label: string }[] = [
  {
    value: "US-West 1",
    label: "US-West 1",
  },
  {
    value: "US-West 2",
    label: "US-West 2",
  },
  {
    value: "US-East 1",
    label: "US-East 1",
  },
  {
    value: "US-East 2",
    label: "US-East 2",
  },
  {
    value: "EU-West 1",
    label: "EU-West 1",
  },
  {
    value: "EU-North 1",
    label: "EU-North 1",
  },
  {
    value: "EU-Central 1",
    label: "EU-Central 1",
  },
]

export const conditions: { value: string; label: string }[] = [
  {
    value: "is-equal-to",
    label: "is equal to",
  },
  {
    value: "is-between",
    label: "is between",
  },
  {
    value: "is-greater-than",
    label: "is greater than",
  },
  {
    value: "is-less-than",
    label: "is less than",
  },
]

export const users: {
  name: string
  initials: string
  email: string
  role: string
}[] = [
  {
    name: "Emma Stone",
    initials: "ES",
    email: "a.stone@gmail.com",
    role: "viewer",
  },
  {
    name: "Alissia McCalister",
    initials: "AM",
    email: "a.stone@gmail.com",
    role: "viewer",
  },
  {
    name: "Emily Luisa Bernacle",
    initials: "EB",
    email: "e.luis.bernacle@gmail.com",
    role: "member",
  },
  {
    name: "Aaron Wave",
    initials: "AW",
    email: "a.flow@acme.com",
    role: "contributor",
  },
  {
    name: "Thomas Palstein",
    initials: "TP",
    email: "t.palstein@acme.com",
    role: "viewer",
  },
  {
    name: "Sarah Johnson",
    initials: "SJ",
    email: "s.johnson@gmail.com",
    role: "admin",
  },
  {
    name: "Megan Katherina Brown",
    initials: "MB",
    email: "m.lovelybrown@gmail.com",
    role: "contributor",
  },
]

export const invitedUsers: {
  initials: string
  email: string
  role: string
  expires: number
}[] = [
  {
    initials: "LP",
    email: "lydia.posh@gmail.com",
    role: "viewer",
    expires: 12,
  },
  {
    initials: "AW",
    email: "awidburg@bluewin.ch",
    role: "viewer",
    expires: 8,
  },
]

export const usage: Usage[] = [
  {
    resourceName: "Installing Visual Studio",
    course: "CS-225",
    professor: "Kathy Rossi",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "Linux VM",
    course: "CS-420",
    professor: "John Jeffrey",
    status: "inactive",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "CyberSecurity VM",
    course: "CYS-415",
    professor: "David Brown",
    status: "planned",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "ANTLR4 Guide",
    course: "CS-435",
    professor: "John Jeffrey",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "Web-App Resources",
    course: "CS-440",
    professor: "Dean Jensen",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "Assembly in Visual Studio Guide",
    course: "CS-310",
    professor: "Sony Lawrence",
    status: "inactive",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "CISCO Packet Tracer",
    course: "CS-360",
    professor: "Sony Lawrence",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "Python Installation",
    course: "CS-418",
    professor: "Kathy Rossi",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "Yacc Resources",
    course: "CS-435",
    professor: "John Jeffrey",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "DSA Resources",
    course: "CS-320",
    professor: "John Jeffrey",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },

  {
    resourceName: "DFS and BFS Resources",
    course: "CS-418",
    professor: "Kathy Rossi",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },
  {
    resourceName: "Logic Programming",
    course: "CS-418",
    professor: "Kathy Rossi",
    status: "live",
    lastEdited: "23/09/2023 13:00",
  },
]

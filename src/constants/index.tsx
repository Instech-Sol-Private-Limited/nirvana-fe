import {
  facebook,
  instagram,
  success_stories,
  teaching_guides,
  twitter,
  video_tutorials,
  webinars,
  youtube,
} from "../../public";

export const navlinks = [
  {
    id: 1,
    label: "Home",
    url: "/",
  },
  {
    id: 2,
    label: "About",
    url: "/about",
  },
  {
    id: 3,
    label: "Services",
    url: "/services",
  },
  {
    id: 4,
    label: "Resource Center",
    url: "#",
    hasSubmenu: true,
    submenu: [
      {
        id: 1,
        label: "All Resource",
        url:"/resources",
        tagline:"Best practices, lesson plans, and classroom strategies.",
        icon: teaching_guides,
      },
      {
        id: 2,
        label: "Early years",
        url:"/resources/early-years",
        tagline:"Stories of teachers excelling in Gulf schools.",
        icon: success_stories,
      },
      {
        id: 3,
        label: "Primary",
        url:"/resources/primary",
        tagline:"Step-by-step guides for using our platform & tools.",
        icon: video_tutorials,
      },
      {
        id: 4,
        label: "Secondary",
        url:"/resources/secondary",
        tagline:"Upcoming events and live training sessions.",
        icon: webinars,
      },
      // {
      //   id: 5,
      //   label: "Documentation",
      //   url:"/resources/documentation",
      //   tagline:"Learn how to navigate our system and make the most of it.",
      //   icon: documentation,
      // },
      // {
      //   id: 6,
      //   label: "Certification Programs",
      //   url:"/resources/certification-programs",
      //   tagline:"Courses to enhance your teaching credentials.",
      //   icon: certification_programs,
      // },
      // {
      //   id: 7,
      //   label: "Education Trends",
      //   url:"/resources/education-trends",
      //   tagline:"Stay updated on the latest in Gulf education.",
      //   icon: education_trends,
      // },
    ],
  },
  {
    id: 5,
    label: "Jobs",
    url: "/jobs",
  },
  {
    id: 6,
    label: "Discussion Forums",
    url: "/discussion-forums",
  },
  {
    id: 7,
    label: "Contact Us",
    url: "/contact-us",
  },
];

export const footer_social_icons = [
  {
    id: 1,
    icon: facebook,
    alt: "facebook",
  },
  {
    id: 2,
    icon: twitter,
    alt: "twitter",
  },
  {
    id: 3,
    icon: youtube,
    alt: "youtube",
  },
  {
    id: 4,
    icon: instagram,
    alt: "instagram",
  },
];

export const footer_links = [
  {
    title: "Educators",
    items: [
      {
        id: 1,
        label: "Resources",
        link: "/resources",
      },
      {
        id: 2,
        label: "Job Listings",
        link: "/job-listings",
      },
      {
        id: 3,
        label: "Professional Development",
        link: "/professional-development",
      },
      {
        id: 4,
        label: "Testimonial",
        link: "/testimonial",
      },
    ],
  },
  {
    title: "Institutions",
    items: [
      {
        id: 1,
        label: "Advertise Jobs",
        link: "/advertise-jobs",
      },
      {
        id: 2,
        label: "School Directory",
        link: "/school-directory",
      },
      {
        id: 3,
        label: "Recruitment Solutions",
        link: "/recruitment-solutions",
      },
      {
        id: 4,
        label: "Contact Us",
        link: "/contact-us",
      },
    ],
  },
];
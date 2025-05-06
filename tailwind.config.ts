import type { Config } from "tailwindcss";

export default {
  darkMode: ["class"],
  content: ["./src/**/*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    extend: {
      colors: {
        banner: "#67C394",
        secondary: {
          DEFAULT: "hsl(var(--secondary))",
          foreground: "hsl(var(--secondary-foreground))",
        },
        primary: {
          DEFAULT: "var(--foreground)",
          foreground: "hsl(var(--foreground))",
        },
        textdark: "#343434",
        textlight: "#7A7A7A",
        background: "hsl(var(--background))",
        foreground: "hsl(var(--foreground))",
        card: {
          DEFAULT: "hsl(var(--card))",
          foreground: "hsl(var(--card-foreground))",
        },
        popover: {
          DEFAULT: "hsl(var(--popover))",
          foreground: "hsl(var(--popover-foreground))",
        },
        muted: {
          DEFAULT: "hsl(var(--muted))",
          foreground: "hsl(var(--muted-foreground))",
        },
        accent: {
          DEFAULT: "hsl(var(--accent))",
          foreground: "hsl(var(--accent-foreground))",
        },
        destructive: {
          DEFAULT: "hsl(var(--destructive))",
          foreground: "hsl(var(--destructive-foreground))",
        },
        border: "hsl(var(--border))",
        input: "hsl(var(--input))",
        ring: "hsl(var(--ring))",
        chart: {
          "1": "hsl(var(--chart-1))",
          "2": "hsl(var(--chart-2))",
          "3": "hsl(var(--chart-3))",
          "4": "hsl(var(--chart-4))",
          "5": "hsl(var(--chart-5))",
        },
      },
      fontFamily: {
        montserrat: ["var(--font-montserrat)", "sans-serif"],
        roboto: ["var(--font-roboto)", "sans-serif"],
      },
      backgroundImage: {
        hero: "linear-gradient(to top, rgba(0,108,53,0.3), rgba(0,108,53,0.3))",
        "select-login-hero":
          "linear-gradient(-50deg, rgba(23, 193, 91, 0.05) -0.02%, rgba(0, 108, 53, 0.85) 141.03%), url('/auth/bg_select_role.png')",
        gradientPrimary: "linear-gradient(30deg, #17C15B 70%, #006C35 100%)",
        "auth-btn":
          "var(--gradient, linear-gradient(50deg, #17C15B -0.02%, #006C35 141.03%))",
        about:
          "linear-gradient(50deg, #006C35 -0.02%, rgba(141, 27, 61, 0.00) 141.03%), url('/bg2.png')",
        login: "url('/auth/bg_login.jpg')",
        "school-login":
          "linear-gradient(50deg, rgba(3, 82, 3, 0.85) -0.05%, rgba(0, 56, 0, 0.4) 90%), url('/auth/bg_school.png')",
        "teacher-login":
          "linear-gradient(50deg, rgba(3, 82, 3, 0.85) -0.05%, rgba(0, 56, 0, 0.4) 90%), url('/auth/bg_teacher.png')",
        "recruiter-login":
          "linear-gradient(50deg, rgba(3, 82, 3, 0.85) -0.05%, rgba(0, 56, 0, 0.4) 90%), url('/auth/bg_recruiter.png')",
        "supplier-login":
          "linear-gradient(50deg, rgba(3, 82, 3, 0.85) -0.05%, rgba(0, 56, 0, 0.4) 90%), url('/auth/bg_supplier.png')",
        "school-registration": "url('/auth/registration_school.png')",
        "teacher-registration": "url('/auth/registration_teacher.png')",
        "teacher-supplier": "url('/auth/registration_supplier.png')",
        "job-banner":
          "linear-gradient(180deg, rgba(0, 115, 46, 0.00) 0%, #00732E 117.55%), url('/jobs/job_banner.png')",
      },
      boxShadow: {
        "card-shadow": "0px 6.99px 8.21px 0px #00000009",
        button: "0px 12px 25px 0px rgba(163, 143, 253, 0.25)",
        "button-shadow": "0px 12px 25px 0px rgba(35, 35, 35, 0.25)",
        accordion: "0px 5px 16px 0px rgba(8, 15, 52, 0.06)",
        icons:
          "0px 3.31px 3.32px 0px #00000005, 0px 6.99px 8.21px 0px #00000009, 0px 11.89px 16.44px 0px #0000000D, 10px 20.72px 33.62px 0px #00000012, 10px 51px 94px 0px #0000001C",
        newsletter:
          "10px 51px 94px 0px rgba(0,0,0,0.11), 10px 20.718px 33.619px 0px rgba(0,0,0,0.07), 0px 11.89px 16.44px 0px rgba(0,0,0,0.05), 0px 6.994px 8.206px 0px rgba(0,0,0,0.04), 0px 3.307px 3.318px 0px rgba(0,0,0,0.02)",
        "slider-card":
          "10px 20.718px 33.619px 0px rgba(0, 0, 0, 0.07), 0px 3.307px 3.318px 0px rgba(0, 0, 0, 0.02)",
        label:
          "0px 1px 2px 0px rgba(43, 43, 43, 0.08), 0px 2px 6px 0px rgba(43, 43, 43, 0.02)",
        sidebar: "0px 4px 20px 0px rgba(43, 43, 43, 0.06)",
      },
      borderRadius: {
        lg: "var(--radius)",
        md: "calc(var(--radius) - 2px)",
        sm: "calc(var(--radius) - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: {
            height: "0",
          },
          to: {
            height: "var(--radix-accordion-content-height)",
          },
        },
        "accordion-up": {
          from: {
            height: "var(--radix-accordion-content-height)",
          },
          to: {
            height: "0",
          },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
      },
    },
  },
  plugins: [require("tailwindcss-animate")],
} satisfies Config;

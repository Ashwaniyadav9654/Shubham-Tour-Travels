# Shubham Tour & Travels – Premium Luxury Travel Platform v2.0

A full-stack ready, production-grade luxury travel platform built with React + TypeScript + Tailwind CSS + Framer Motion.

## ✨ Features

- **Cinematic hero** with real-time quick inquiry form
- **Premium fleet showcase** – Maharaja Traveller, Tempo Traveller, Innova Crysta, SUVs, Sedans
- **Tour packages** – Manali, Shimla, Golden Triangle, Haridwar, Corbett, Mathura
- **Service pages** – Airport Transfer, Corporate, Wedding, Group Tours
- **Booking form** → WhatsApp integration (instant inquiry)
- **Admin dashboard** – fleet & review management panel
- **Authentication** – login/register with role-based access
- **SEO optimised** – meta tags, schema.org JSON-LD, canonical URLs
- **Full responsive** – mobile-first design
- **Framer Motion** animations throughout
- **WhatsApp float button** – always visible
- **Gold/Black luxury palette** – Tesla/Apple inspired

## 🚀 Quick Start

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173)

## 🗂 Project Structure

```
src/
├── components/
│   ├── layout/        # Navbar, Footer, Layout
│   └── sections/      # Hero, Fleet, Services, Reviews, CTA, WhatsApp
├── context/           # AuthContext
├── data/              # All static data (vehicles, packages, reviews, blog)
├── lib/               # utils, WhatsApp helpers
├── pages/             # All route pages
└── types/             # TypeScript interfaces
```

## 📄 Pages

| Route | Page |
|-------|------|
| `/` | Home |
| `/fleet` | Fleet Showcase |
| `/fleet/:slug` | Vehicle Detail |
| `/tours` | Tour Packages |
| `/airport-transfer` | Airport Transfer |
| `/corporate` | Corporate Services |
| `/wedding` | Wedding Transport |
| `/gallery` | Gallery |
| `/reviews` | Reviews |
| `/blog` | Blog |
| `/about` | About Us |
| `/contact` | Contact |
| `/booking` | Booking Form |
| `/login` | Login / Register |
| `/admin` | Admin Dashboard |

## 🔐 Admin Access

Email: `admin@shubhamtravels.com`  
Password: `admin@2024`

## 🎨 Design System

- **Primary font:** Playfair Display (display/headings)
- **Body font:** DM Sans
- **Gold palette:** `#c9922a` → `#e9c565`
- **Dark palette:** `#0a0a0a` obsidian
- **Glassmorphism**, shimmer effects, hover lifts

## 📱 WhatsApp Integration

All booking and inquiry forms → WhatsApp  
Number: `+91 98113 68167`

## 🔧 Backend Ready (Future)

Extend with:
- Node.js + Express API → `backend/`
- MongoDB for bookings, fleet, users
- GPS tracking integration
- Payment gateway (Razorpay)
- Mobile app (React Native)

## 🌐 SEO

- Optimised meta tags per page
- JSON-LD Schema.org TravelAgency markup
- Canonical URLs
- Keywords: Luxury Tempo Traveller Gurgaon, Corporate Cab Services, Innova Crysta Rental Delhi NCR

'use strict';

/**
 * Database Seeder Script.
 * Clears any existing jobs in MongoDB and populates it with the initial 13 open channels.
 * Run via: node src/utils/seedJobs.js (from the backend/ directory)
 */

const path = require('path');
// Load environment configuration
require('dotenv').config({ path: path.resolve(__dirname, '../../../.env') });

const connectDB = require('../config/db');
const Job = require('../models/Job');
const logger = require('../config/logger');

const ROLES = [
  {ch:"CH-01",dept:"Marketing",title:"Senior Brand Manager",loc:"Pune · Onsite",exp:"3–5 years",type:"Full-time",
   role:"Lead creative strategies, client communications, and campaign execution for major D2C brands.",
   reqs:["Proven experience managing brand campaigns end to end.","Excellent communication and leadership skills.","Deep understanding of motion content and digital distribution."]},
  {ch:"CH-02",dept:"Marketing",title:"Brand Manager",loc:"Pune · Onsite",exp:"2–3 years",type:"Full-time",
   role:"Execute digital brand strategies, manage creator partnerships, and coordinate campaign delivery.",
   reqs:["Strong marketing background and visual taste.","Detail-oriented campaign management skills.","Ability to translate creator signals into brand ideas."]},
  {ch:"CH-03",dept:"Production & Post",title:"Content Strategist",loc:"Pune · Onsite",exp:"1–2 years",type:"Full-time",
   role:"Ideate, script, and direct short-form content pipelines for creators and brands.",
   reqs:["Hook-writing and copywriting expertise.","Fluent in Shorts, Reels and short-form formats.","Active interest in internet culture and creator dynamics."]},
  {ch:"CH-04",dept:"Production & Post",title:"Cinematographer",loc:"Pune · Onsite",exp:"1–2 years",type:"Full-time",
   role:"Direct camera movement, set lighting rigs, and shoot cinematic studio and outdoor motion assets.",
   reqs:["Experience with cinema cameras (RED, Sony FX, Arri, Blackmagic).","Expert lighting (interior, studio, natural light).","Portfolio with exceptional visual framing."]},
  {ch:"CH-05",dept:"Production & Post",title:"Sr. Video Editor",loc:"Pune · Onsite",exp:"3+ years",type:"Full-time",
   role:"Lead the editing team, structure high-tempo edits, and refine visual storytelling standards.",
   reqs:["Advanced Premiere Pro, DaVinci Resolve or After Effects.","High speed and precision editing workflow.","Direct sound design, pacing and color grading."]},
  {ch:"CH-06",dept:"Production & Post",title:"Intermediate Video Editor",loc:"Bengaluru · Onsite",exp:"2+ years",type:"Full-time",
   role:"Create visual edits, compile creator reels, and add motion assets and transitions.",
   reqs:["Solid Adobe Premiere or DaVinci Resolve skills.","Strong sense of audio timing and pacing.","Fast, reliable delivery turnarounds."]},
  {ch:"CH-07",dept:"Production & Post",title:"Video Editor",loc:"Pune · Onsite",exp:"2+ years",type:"Full-time",
   role:"Assemble raw footage, cut high-retention vertical videos, and apply motion graphics.",
   reqs:["Premiere Pro, CapCut and similar tools.","Engaging transitions, captions and sound effects.","Eagerness to learn and iterate weekly."]},
  {ch:"CH-08",dept:"Production & Post",title:"Production Assistant",loc:"Pune · Onsite",exp:"1–2 years",type:"Full-time",
   role:"Coordinate shoot logistics, manage equipment inventory, and support directors on set.",
   reqs:["Highly organised with proactive problem-solving.","Manage schedules, crew riders and studio setups.","Passion for production and cinema operations."]},
  {ch:"CH-09",dept:"Production & Post",title:"Graphic Designer",loc:"Pune · Onsite",exp:"2+ years",type:"Full-time",
   role:"Design high-retention thumbnails, brand identities, and social key visuals.",
   reqs:["Photoshop, Illustrator and Figma mastery.","Strong visual hierarchy and bold typography.","Portfolio of modern, high-contrast design."]},
  {ch:"CH-10",dept:"Production & Post",title:"Content Strategist Intern",loc:"Pune · Onsite",exp:"No experience required",type:"Intern",
   role:"Learn scriptwriting, assist in creator research, and brainstorm viral ideas.",
   reqs:["Deeply active on YouTube, Reels and X.","Eager to learn copywriting and script structures.","No formal experience needed — high curiosity is."]},
  {ch:"CH-11",dept:"Growth",title:"Performance Marketing Executive",loc:"Pune · Onsite",exp:"2+ years",type:"Full-time",
   role:"Manage and optimise paid campaigns (Meta, Google, YouTube) to drive brand growth.",
   reqs:["Hands-on running ads and allocating budgets.","Strong analytics — ROAS, CAC, conversion.","Brief design on high-performance ad creative."]},
  {ch:"CH-12",dept:"Operations",title:"Human Resources",loc:"Pune · Onsite",exp:"1+ year",type:"Part-time",
   role:"Manage recruitment pipelines, onboarding flows, and employee engagement.",
   reqs:["Strong screening, sourcing and communication.","Familiar with creator or tech-agency hiring.","Empathy and professional workplace management."]},
  {ch:"CH-13",dept:"Operations",title:"HR Intern",loc:"Pune · Onsite",exp:"No experience required",type:"Intern",
   role:"Assist with resume screening, candidate scheduling, and HR database coordination.",
   reqs:["Excellent communication and writing.","Organised, with Sheets / database fluency.","Pursuing or recently completed an MBA / HR degree."]},
];

async function seed() {
  let conn;
  try {
    conn = await connectDB();
    logger.info('Database connection established for seeding.');

    // 1. Clear existing jobs
    await Job.deleteMany({});
    logger.info('Cleared existing jobs from database.');

    // 2. Insert initial roles
    const inserted = await Job.insertMany(ROLES);
    logger.info(`Successfully seeded database with ${inserted.length} jobs.`);

    process.exit(0);
  } catch (err) {
    logger.error(`Database seeding failed: ${err.message}\n${err.stack}`);
    process.exit(1);
  }
}

seed();

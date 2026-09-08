# TECH2451-01 Cloud Development — Bow Valley College

- Instructor: Rong Wang (Aurora) — contact via MS Teams message
- Format: online asynchronous, no scheduled meeting time
- Content: AWS services via LocalStack; lecture recordings, slides, and demo code posted in course Teams
- D2L course home: https://d2l.bowvalleycollege.ca/d2l/home/485607

## Local environment setup

1. Terminal 1: run `localstack start`, wait for "Running on https://0.0.0.0:4566"
2. Terminal 2: use `awslocal` commands (instead of `aws`) to simulate cloud operations locally

## Project repos

**TECH2451 uses ONE shared base repo for all 5 projects, not per-project repos.**
Confirmed by inspecting `enterprise-cloud-developer-base`'s `scripts/` folder,
which already contains provisioning script stubs for every project
(`t1_*.sh` through `t5_*.sh`), plus a single `lambda/` folder holding the
Lambda function code all 5 projects build on. There's nothing to fork
per-project — the one fork below covers the whole course.

| Project | Original repo | Your fork | Local folder |
|---|---|---|---|
| All 5 (shared base) | [hlugo-bvc/enterprise-cloud-developer-base](https://github.com/hlugo-bvc/enterprise-cloud-developer-base) | [eddie7ch/enterprise-cloud-developer-base](https://github.com/eddie7ch/enterprise-cloud-developer-base) | `enterprise-cloud-developer-base/` |

Legacy/unused (linked from a 2021-dated "Welcome" post, from an older course
offering — not referenced by the current Assessment Overview or any Part 1-5
instruction PDF; cloned early on before this was confirmed, kept only for
reference):

| Repo | Original | Local folder |
|---|---|---|
| Practice (unused) | [hlugo-bvc/enterprise-cloud-developer-practice](https://github.com/hlugo-bvc/enterprise-cloud-developer-practice) | `enterprise-cloud-developer-practice/` |
| Apply (unused) | [hlugo-bvc/enterprise-cloud-developer-apply](https://github.com/hlugo-bvc/enterprise-cloud-developer-apply) | `enterprise-cloud-developer-apply/` |

LinkedIn Learning videos (some Learning Activities require this):
- https://www.linkedin.com/learning
- Login: username@mybvc.ca + mybvc password

## Assignment due dates

| Assignment | Due date |
|---|---|
| Project 1. Develop an API Endpoint | Sep 29, 2026, 11:59 PM |
| Project 2. Integrate Data Storage | Oct 20, 2026, 11:59 PM |
| Project 3. Secure the Application Program Interface | Nov 3, 2026, 11:59 PM |
| Project 4. Implement the File Management Solution | Nov 17, 2026, 11:59 PM |
| Project 5. Implement Asynchronous Communication and Data Processing | Dec 1, 2026, 11:59 PM |

## Course structure / term dates

- **Total assignments: 5** (Project 1-5). Confirmed three ways: Course Outline
  PDF grading scheme ("Assignments (Minimum of 5) — 90%", plus Professionalism
  10%), the Assessments module in Content (5 project sub-topics), and the
  Dropbox/Assignment folder listing (5 folders, worth 12/9/6/9/12 points).
- **Course Outline PDF is a generic template** ("Fall 2024 - Current", last
  updated 5/30/2024) — 15-week module schedule (Reading Week is week 9),
  no term-specific dates; it explicitly says to check Brightspace's Course
  Offering Information for exact dates instead.
- **Fall 2026 term dates** (from bowvalleycollege.ca/apply/dates-and-deadlines/important-dates,
  not from the course outline): **September 1 - December 18, 2026**. Reading
  Week is Nov 9-13, 2026 (matches week 9 of the course's module schedule).
- Note: the term ends Dec 18, but the last graded project (Project 5) is due
  Dec 1, 2026 — about two weeks before the term itself ends.

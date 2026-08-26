# UoH Game — Canonical Location & Event Deduplication Audit Report

## 1. Executive Summary

This report documents the canonical location, event, and spatial deduplication performed across all 6 campus sections in the **University of Hyderabad Campus Adventure** game.

- **Total Canonical Locations**: 95 unique landmarks
- **Total Registered Aliases**: 285+ vernacular and academic aliases
- **Total Quests**: 7 verified quest lines
- **Total NPCs**: 14 uniquely positioned characters
- **Canonical ID Migration**: Active for backwards compatibility with saved games (e.g., `#98` Mushroom Rock $\rightarrow$ `#27` The Masoom's Rock)

---

## 2. Spatial Normalization & Section Offsets

Each of the 6 sections has an authoritative offset in Master World Space:

| Section | Origin X | Origin Y | Width (px) | Height (px) | Landmarks | Role / Geography |
| :--- | :--- | :--- | :--- | :--- | :--- | :--- |
| **`main`** | `0` | `0` | `1700` | `1350` | 21 | North Core: Humanities, Social Sciences, CIL, Masoom's Rock, Buffalo Lake |
| **`east`** | `1700` | `0` | `2400` | `1600` | 40 | East Core: SCIS, IGM Library, Sukoon, CR Rao, Peacock Lake, Stadiums |
| **`south`** | `0` | `1350` | `2000` | `1900` | 24 | South Core: Life Sciences, CIS, Nanotech, Hostels, Check Dam, Amphitheatre |
| **`west`** | `-1400` | `1350` | `1400` | `1200` | 6 | West Enclave: Indoor Stadium & Gym, Central Workshop, IDC Gate 3 |
| **`amphi_valley`** | `1600` | `1350` | `1600` | `1200` | 1 | Natural Sanctuary: Secret Lake |
| **`checkdam_buffer`**| `400` | `1000` | `1400` | `1000` | 3 | Heritage Buffer: Globbo Rock, Chinna Gudi Temple, Tamarind Tree |

---

## 3. Deduplication Classifications & Findings

### Category A: Exact / Semantic Duplicates (Resolved)

1. **The Masoom's Rock (`#27`) vs Mushroom Rock (`#98`)**:
   - *Classification*: `EXACT_DUPLICATE`
   - *Resolution*: Removed `#98` and established `#27` ("The Masoom's Rock") as the single canonical geological wonder with aliases `["Masoom's Rock", "Mushroom Cap Rock", "Balancing Rock"]`.
   - *Migration*: `98 -> 27` in `LOCATION_ID_MIGRATIONS`.

2. **GMC Balayogi Sports Complex (`#92`) vs Gachibowli Stadium (`#93`)**:
   - *Classification*: `SEMANTIC_OVERLAP`
   - *Resolution*: Disambiguated into two distinct sporting facilities:
     - `#92`: `GMC Balayogi Athletics Stadium` (Colosseum Track & Field)
     - `#93`: `Gachibowli Aquatics & Indoor Arena` (Olympic Swimming & Diving Complex)

3. **Administration Building (`#36`) vs Central Administrative Pavilion (`#85`)**:
   - *Classification*: `SEMANTIC_OVERLAP`
   - *Resolution*: `#36` is the single authoritative Administration Building. `#85` was clarified as `Central Convocation & Floral Pavilion` (Ceremonial rotunda dome).

4. **Security Office / Dhobi (`#69`) vs HCU Small Gate Security (`#41`)**:
   - *Classification*: `SEMANTIC_OVERLAP`
   - *Resolution*: `#69` renamed to `Campus Dhobi & Laundry Center`.

5. **CIS Lab in Main (`#50`) vs Centre for Integrated Studies (`#5`)**:
   - *Classification*: `ACRONYM_COLLISION`
   - *Resolution*: `#50` in Main Campus renamed to `Centre for Neural & Cognitive Sciences (CNCS)`.

6. **CIS Reading Room (`#6`) vs Centre for Integrated Studies (`#5`)**:
   - *Classification*: `INTERNAL_FACILITY_OVERLAP`
   - *Resolution*: `#6` established as `South Campus Student Study Lounge`.

7. **Sarojini Naidu School (`#54`, `#55`, `#56`)**:
   - *Classification*: `INTERNAL_DEPARTMENT_DISTINCTION`
   - *Resolution*:
     - `#56`: `Sarojini Naidu School Main Building`
     - `#54`: `SN School Theatre & Performing Arts Wing`
     - `#55`: `SN School Media & Broadcast Studio`

---

### Category B: Legitimate Distinct Venues (Retained)

- **Ladies Hostels (LH-1 to LH-4 in East; LH-7 to LH-10 in South)**: Distinct physical student dormitories.
- **Men's Hostels (MH-C, MH-D, MH-H in Main; MH-I, MH-J, MHK, MH-L in South; MH-M in East)**: Distinct physical student dormitories.
- **Shopping Complexes (North Complex #33 vs South Complex #9)**: Separate commercial plazas serving different zones.
- **Lakes & Dams (Buffalo Lake #26, Auroya Dam #29, Check Dam #1, Amphi Lake #20, Secret Lake #22, Peacock Lake #28)**: 6 distinct natural water bodies.
- **Temples (Chinna Gudi #18 in Buffer vs Sai Baba Temple #89 in East)**: Distinct historic & modern religious sites.

---

## 4. Canonical System Architecture

```text
                           MASTER CAMPUS WORLD
                                    │
                         ┌──────────┴──────────┐
                         ▼                     ▼
                locations.json          SECTION_OFFSETS
                         │                     │
                         └──────────┬──────────┘
                                    ▼
                          LocationRegistry.js
                  (Canonical IDs, Aliases, Migrations)
                                    │
      ┌──────────────┬──────────────┼──────────────┬──────────────┐
      ▼              ▼              ▼              ▼              ▼
  WorldMap      CampusMapUI   DiscoverySystem  QuestSystem    Interiors
      │              │              │              │              │
      ▼              ▼              ▼              ▼              ▼
   Canvas        Radar HUD        Score          Quests       Rooms/Doors
```

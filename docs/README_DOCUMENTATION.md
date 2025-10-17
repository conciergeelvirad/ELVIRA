# 📝 Documentation Guidelines

## 🎯 Important Reminder

**ALL NEW DOCUMENTATION MUST BE CREATED IN THE `/docs` FOLDER**

Starting from **October 17, 2025**, all project documentation is centralized in the `/docs` directory for better organization and maintainability.

## 📁 Folder Structure

```
HOTEL-ELVIRA/
├── docs/                          ← ALL DOCUMENTATION HERE
│   ├── INDEX.md                   ← Main documentation index
│   ├── README_DOCUMENTATION.md    ← This file
│   ├── archive/                   ← Old/archived docs
│   ├── components.md              ← Component docs
│   └── *.md                       ← All other documentation
├── src/                           ← Source code only
├── database/                      ← Database scripts
└── README.md                      ← Project README (stays in root)
```

## ✅ What Goes in `/docs`

### ✅ DO Store in `/docs`:
- ✅ Implementation guides
- ✅ Feature documentation
- ✅ API integration docs
- ✅ Refactoring plans and summaries
- ✅ Bug fix documentation
- ✅ Testing guides
- ✅ Architecture documentation
- ✅ Database schema docs
- ✅ Component documentation
- ✅ How-to guides
- ✅ Quick references
- ✅ Change logs for major features

### ❌ DON'T Store in `/docs`:
- ❌ Source code files (`.ts`, `.tsx`, `.js`)
- ❌ Configuration files (`.json`, `.js` configs)
- ❌ Build output
- ❌ Node modules
- ❌ Environment files (`.env`)

## 📝 File Naming Conventions

Use descriptive, uppercase names with underscores:

### Good Examples:
```
✅ GUEST_AUTHENTICATION_GUIDE.md
✅ LANGUAGE_DROPDOWN_IMPLEMENTATION.md
✅ AMADEUS_API_INTEGRATION_COMPLETE.md
✅ STAFF_SCHEDULE_REFACTORING_PLAN.md
✅ DATABASE_SCHEMA_UPDATE.md
```

### Bad Examples:
```
❌ docs.md (too generic)
❌ fix.md (not descriptive)
❌ temp_notes.md (no temporary files)
❌ MyFeature.md (wrong casing)
❌ feature-guide.md (use underscores, not hyphens)
```

### Common Suffixes:
- `_GUIDE.md` - How-to guides
- `_COMPLETE.md` - Completed implementations
- `_PLAN.md` - Planning documents
- `_FIX.md` - Bug fixes
- `_IMPLEMENTATION.md` - Implementation details
- `_INTEGRATION.md` - Integration documentation
- `_REFACTORING.md` - Refactoring documentation
- `_SUMMARY.md` - Summary documents
- `_QUICK_REFERENCE.md` - Quick reference guides

## 📋 Document Template

When creating new documentation, use this template:

```markdown
# Feature/Component Name - Purpose

## 📊 Overview

Brief description of what this document covers.

## 🎯 Purpose

Why this feature/change was needed.

## ✅ Implementation

### What Was Done
- List key changes
- Implementation details
- Files modified/created

### Technical Details
Code examples, architecture decisions, etc.

## 🧪 Testing

How to test the feature/changes.

## 📝 Usage

How to use this feature (if applicable).

## 🐛 Known Issues

Any known limitations or issues.

## 🔄 Future Improvements

Potential enhancements or next steps.

---

**Status**: ✅ Complete / 🚧 In Progress / 📝 Planned  
**Date**: October 17, 2025  
**Author**: [Your Name/Team]  
**Related Docs**: Links to related documentation
```

## 🔍 Before Creating New Documentation

1. **Check if documentation already exists**
   - Search the [`INDEX.md`](./INDEX.md)
   - Use file search: `Ctrl+P` and type the feature name

2. **Choose the right location**
   - All docs in `/docs` root unless archiving
   - Use `/docs/archive/` for deprecated docs

3. **Use descriptive names**
   - Name should clearly indicate content
   - Use full words, not abbreviations (unless widely known)

4. **Update the INDEX.md**
   - Add your new document to the appropriate section
   - Keep the index organized and up-to-date

## 📚 Documentation Types

### 1. **Implementation Guides** (How to implement features)
Example: `GUEST_AUTHENTICATION_IMPLEMENTATION.md`

### 2. **Quick References** (Fast lookup guides)
Example: `AMADEUS_QUICK_REFERENCE.md`

### 3. **Complete Documentation** (Finished features)
Example: `LANGUAGE_DROPDOWN_ENHANCEMENT_COMPLETE.md`

### 4. **Refactoring Plans** (Code improvement plans)
Example: `CART_REFACTORING_PLAN.md`

### 5. **Bug Fixes** (Issue resolutions)
Example: `LOCALE_FIX_QUICK_GUIDE.md`

### 6. **Integration Guides** (Third-party integrations)
Example: `GOOGLE_PLACES_INTEGRATION.md`

## ✨ Best Practices

### DO:
- ✅ Write clear, concise titles
- ✅ Include code examples
- ✅ Add status indicators (✅ ❌ 🚧)
- ✅ Include dates and version info
- ✅ Link to related documentation
- ✅ Use proper markdown formatting
- ✅ Add visual aids (diagrams, tables)
- ✅ Include "before and after" comparisons
- ✅ Document breaking changes clearly

### DON'T:
- ❌ Create duplicate documentation
- ❌ Use vague titles
- ❌ Leave documents incomplete
- ❌ Store temporary notes
- ❌ Mix code and documentation
- ❌ Forget to update the INDEX
- ❌ Use inconsistent formatting

## 🔄 Updating Existing Documentation

When updating existing docs:

1. **Update the date** at the bottom
2. **Add changelog** if significant changes
3. **Update status** if completion state changes
4. **Update INDEX.md** if title/purpose changes
5. **Archive old version** if major rewrite (optional)

## 📊 Documentation Status Indicators

Use these in your documentation:

- ✅ **Complete** - Fully implemented and tested
- 🚧 **In Progress** - Currently being implemented
- 📝 **Planned** - Scheduled for future
- ⚠️ **Deprecated** - No longer in use
- 🔄 **Updated** - Recently modified
- 🐛 **Bug Fix** - Addresses an issue
- 🎯 **High Priority** - Important feature
- 💡 **Tip** - Helpful information
- ⚡ **Quick Note** - Brief reminder

## 🎯 Summary

**Remember**: 
- 📁 All docs in `/docs`
- 📝 Descriptive names with underscores
- ✅ Include status and dates
- 🔍 Update INDEX.md
- 📚 Follow templates

---

**This guideline is effective from**: October 17, 2025  
**Location**: `/docs/README_DOCUMENTATION.md`  
**Purpose**: Maintain organized, findable documentation

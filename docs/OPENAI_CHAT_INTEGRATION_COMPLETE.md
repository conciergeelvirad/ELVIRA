# OpenAI Analyzer Integration - Guest Chat

## Overview

Successfully integrated the `openai-analyzer` edge function with the guest chat system for automatic AI analysis and translation of guest messages.

## Architecture

### Edge Function

- **Name**: `openai-analyzer`
- **Location**: Supabase Edge Function
- **Capabilities**:
  - Sentiment analysis (positive/negative/neutral)
  - Urgency classification (URGENT/HIGH/MEDIUM/LOW)
  - Topic/subtopic detection (16 departments with detailed subtopics)
  - Automatic translation based on language mismatch
  - Q&A answering using hotel's FAQ database

### Frontend Integration

#### Files Created/Modified

**New Files:**

1. **`src/services/openaiAnalyzer.service.ts`**

   - Service layer for calling the edge function
   - Exports:
     - `analyzeGuestMessage()` - Full pipeline analysis
     - `translateMessage()` - Translation only
     - `answerGuestQuestion()` - Q&A using hotel's FAQ
     - `shouldTranslate()` - Determines if translation needed
     - `getPrimaryHotelLanguage()` - Gets hotel's primary language

2. **`src/pages/Guests/components/Chat/hooks/useMessageAnalysis.ts`**
   - React hook for managing AI analysis in chat context
   - Fetches guest language from `guest_personal_data.language`
   - Fetches hotel languages from `hotels.official_languages`
   - Uses `useEffect` + `useState` pattern (avoids React Query hooks order issues)
   - Returns `analyzeMessage()` function for triggering analysis

**Modified Files:** 3. **`src/pages/Guests/components/Chat/useGuestChat.ts`**

- Integrated `useMessageAnalysis` hook
- Triggers AI analysis automatically after each message is sent
- Non-blocking: Analysis failure doesn't prevent message sending

4. **`src/pages/Guests/components/Chat/hooks/index.ts`**
   - Added export for `useMessageAnalysis`

## Flow Diagram

```
Guest sends message
       ↓
[useGuestChat.sendMessage]
       ↓
Save to guest_messages table ← Returns message.id
       ↓
[onSuccess callback]
       ↓
analyzeMessage(message.id, text)
       ↓
[useMessageAnalysis]
       ↓
Fetch language config:
- guest_personal_data.language
- hotels.official_languages
       ↓
Determine if translation needed
       ↓
[openaiAnalyzer.service]
       ↓
Call edge function: openai-analyzer
  task: "full_pipeline"
  text: message text
  message_id: for DB update
  original_language: guest language
  targetLanguage: hotel primary language
       ↓
OpenAI API calls (parallel):
- Sentiment classification
- Urgency classification
- Topic/subtopic detection
- Translation (if needed)
       ↓
Edge function updates guest_messages:
- sentiment
- urgency
- topics[]
- translated_text
- is_translated
- target_language
- ai_analysis_completed: true
       ↓
Done (non-blocking)
```

## Database Schema Integration

### Language Fields

- **`guest_personal_data.language`**: Single string (e.g., "en", "es")
- **`hotels.official_languages`**: Array of strings (e.g., ["en", "es", "fr"])

### Message Analysis Fields (guest_messages table)

- `sentiment`: string - "positive" | "negative" | "neutral"
- `urgency`: string - "URGENT" | "HIGH" | "MEDIUM" | "LOW"
- `topics`: string[] - Array of department tags
- `translated_text`: string | null - Translated version of message
- `is_translated`: boolean - Whether translation was performed
- `target_language`: string | null - Language translated to
- `ai_analysis_completed`: boolean - Analysis status flag

## Translation Logic

### When Translation Happens

Translation occurs when:

1. Guest has a language set in `guest_personal_data.language`
2. Hotel has languages defined in `hotels.official_languages`
3. Guest's language is NOT in hotel's languages array

### Example Scenarios

**Scenario 1: Translation Needed**

- Guest language: "es" (Spanish)
- Hotel languages: ["en", "fr"]
- Result: ✅ Translates to "en" (first hotel language)

**Scenario 2: No Translation Needed**

- Guest language: "en" (English)
- Hotel languages: ["en", "es", "fr"]
- Result: ❌ No translation (guest speaks hotel language)

**Scenario 3: No Language Data**

- Guest language: null
- Hotel languages: []
- Result: ❌ No translation (no config available)

## Topic Categories

The system classifies messages into 16 coarse departments:

1. `reservation` - Booking related
2. `check-in-out` - Check-in/out processes
3. `room-access` - Keycard, locked out, safe
4. `housekeeping` - Cleaning, towels, laundry
5. `maintenance` - AC, plumbing, electrical issues
6. `amenities` - Gym, pool, spa, concierge
7. `food-beverage` - Room service, restaurant, bar
8. `billing-payment` - Payment issues, invoices
9. `wifi-tech` - Internet, connection issues
10. `transport-parking` - Taxi, shuttle, parking
11. `hotel-info` - Hours, policies, directions
12. `local-recommendations` - Restaurants, attractions
13. `safety-security` - Emergencies, security
14. `lost-and-found` - Lost items
15. `special-requests` - Extra bed, crib, accessibility
16. `other` - General feedback, complaints

Each has detailed subtopics (e.g., `housekeeping.extra-towels`, `maintenance.AC-issue`)

## Error Handling

### Non-Blocking Design

- AI analysis runs **after** message is saved to database
- Uses `.catch()` to prevent chat interruption if analysis fails
- Logs errors but doesn't throw to user
- Chat remains fully functional even if edge function is down

### Logging Strategy

```typescript
✅ Success logs: "✅ [Message Analysis] Complete for message: abc123"
⚠️  Warning logs: "⚠️ [Message Analysis] Failed (non-blocking): error"
🔍 Info logs: "🔍 [Message Analysis] Config: {guestLanguage: 'es', ...}"
❌ Error logs: "❌ [OpenAI Analyzer] Edge function error: ..."
```

## Testing Checklist

### Basic Flow

- [ ] Guest sends message in their native language
- [ ] Message saves to `guest_messages` table immediately
- [ ] Message appears in chat UI right away
- [ ] AI analysis runs in background (check console logs)
- [ ] `guest_messages` record updates with analysis results

### Translation Testing

- [ ] Set guest language to Spanish: `UPDATE guest_personal_data SET language = 'es' WHERE guest_id = '...'`
- [ ] Set hotel languages to English: `UPDATE hotels SET official_languages = ARRAY['en'] WHERE id = '...'`
- [ ] Send Spanish message: "Necesito toallas extra"
- [ ] Check `translated_text` field: Should contain English translation
- [ ] Check `is_translated`: Should be `true`

### No Translation Testing

- [ ] Set guest language to English
- [ ] Set hotel languages to include English
- [ ] Send message
- [ ] Check `is_translated`: Should be `false`
- [ ] Check `translated_text`: Should be `null`

### Topic Detection Testing

Send messages and verify topic classification:

- "The AC is not working" → `maintenance.AC-issue`
- "I need extra towels" → `housekeeping.extra-towels`
- "Can I get a late checkout?" → `check-in-out.late-check-out`
- "The wifi password doesn't work" → `wifi-tech.password-request`

### Urgency Testing

- "URGENT: There's a fire in the hallway!" → `URGENT`
- "The AC is broken and it's very hot" → `HIGH`
- "Can I get extra towels?" → `MEDIUM` or `LOW`

## Performance Considerations

### Async Processing

- Analysis doesn't block message sending
- Uses `Promise.all()` for parallel OpenAI API calls
- Guest sees instant message delivery

### Caching Strategy

- Language config fetched once per chat session via `useEffect`
- Edge function could add caching for repeated translations
- Supabase queries use `.single()` for optimal performance

## Future Enhancements

### Potential Features

1. **Auto-response**: Use Q&A function to auto-reply to common questions
2. **Priority routing**: Route URGENT messages to managers immediately
3. **Analytics dashboard**: Show sentiment trends, common topics
4. **Multi-language support**: Display translated version to staff in UI
5. **Smart suggestions**: Suggest responses based on topic/sentiment
6. **Escalation rules**: Auto-escalate negative + urgent messages

### Q&A Integration

The edge function already supports Q&A:

```typescript
await answerGuestQuestion({
  text: "What time is breakfast?",
  hotel_id: "hotel-123",
});
// Returns: "Breakfast is served from 7:00 AM to 10:30 AM..."
```

Could be used for:

- Auto-reply bot for FAQ questions
- Suggested responses for staff
- Guest self-service knowledge base

## Configuration

### Environment Variables (Edge Function)

- `SUPABASE_URL`: Supabase project URL
- `SUPABASE_SERVICE_ROLE_KEY`: Service role key (for DB updates)
- `OPENAI_API_KEY`: OpenAI API key for GPT-3.5-turbo

### Frontend Configuration

None required - uses existing Supabase client configuration

## Success Metrics

### What to Monitor

1. **Analysis completion rate**: % of messages with `ai_analysis_completed = true`
2. **Translation accuracy**: Staff feedback on translation quality
3. **Topic accuracy**: % of messages correctly categorized
4. **Response time**: Time from message send to analysis complete
5. **Error rate**: Failed analysis attempts

### Expected Behavior

- ✅ 100% of messages sent successfully (regardless of analysis)
- ✅ 95%+ analysis completion rate (if edge function is healthy)
- ✅ <2 second analysis time for most messages
- ✅ Zero user-facing errors (all failures are logged, not shown)

## Documentation Links

- Edge Function Code: (provided in chat)
- React Query Docs: https://tanstack.com/query/latest
- OpenAI API: https://platform.openai.com/docs
- Supabase Edge Functions: https://supabase.com/docs/guides/functions

---

**Status**: ✅ Complete and integrated
**Last Updated**: 2025-10-15
**Next Steps**: Test with real guest messages, monitor analysis accuracy

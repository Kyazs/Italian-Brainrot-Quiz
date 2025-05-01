import { createClient } from '@supabase/supabase-js';

// Directly use Supabase credentials
const supabaseUrl = 'https://xeuxiosfgrpwtlpqiibh.supabase.co';
const supabaseAnonKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InhldXhpb3NmZ3Jwd3RscHFpaWJoIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NDUwNzQyODAsImV4cCI6MjA2MDY1MDI4MH0.TwbKNP5wR82ZR3pvvoJ5d3LP1HuxfX7raCOZ3gLjZjw';

// Create Supabase client
export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// 30 minutes in milliseconds
const THIRTY_MINUTES_MS = 30 * 60 * 1000;

// Function to track user visits with cache to prevent multiple recordings within 30 minutes
export const trackVisit = async () => {
  try {
    // Check localStorage for the last visit timestamp
    const lastVisitTime = localStorage.getItem('brainrot_last_visit');
    const currentTime = Date.now();
    
    // If there's a record of the last visit and it was less than 30 minutes ago, don't record a new visit
    if (lastVisitTime && (currentTime - parseInt(lastVisitTime, 10)) < THIRTY_MINUTES_MS) {
      console.log('Visit already recorded within the last 30 minutes. Skipping...');
      return;
    }
    
    // Get device information (simple mobile detection)
    const isMobile = /iPhone|iPad|iPod|Android/i.test(navigator.userAgent);
    const device = isMobile ? 'Mobile' : 'Desktop';
    
    // Get local date time formatted as mm/dd/yyyy hh:mm AM/PM
    const now = new Date();
    const dateOptions: Intl.DateTimeFormatOptions = { 
      month: '2-digit', 
      day: '2-digit', 
      year: 'numeric',
      hour: 'numeric',
      minute: '2-digit',
      hour12: true
    };
    const formattedDateTime = now.toLocaleString('en-US', dateOptions);
    
    // Insert visit data into Supabase
    const { error } = await supabase
      .from('viewCount_Brainrot')
      .insert([
        { 
          device: device,
          created_at: formattedDateTime
        }
      ]);
      
    if (error) throw error;
    
    // Store the current timestamp in localStorage to prevent multiple recordings
    localStorage.setItem('brainrot_last_visit', currentTime.toString());
    
    console.log('Visit tracked successfully');
  } catch (error) {
    console.error('Error tracking visit:', error);
  }
};
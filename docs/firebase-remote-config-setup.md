# Firebase Remote Config Setup Guide

## Quick Setup Instructions

### 1. Enable Firebase Remote Config
1. Go to [Firebase Console](https://console.firebase.google.com)
2. Select your project: `rudybtz-portfolio`
3. Navigate to **Remote Config** in the left sidebar
4. Click **Create configuration** if this is your first time

### 2. Add Default Parameters

Copy and paste these parameters into your Firebase Remote Config:

#### Theme Parameters
```
theme_primary_color: "222.2 84% 4.9%"
theme_secondary_color: "210 40% 98%"
theme_accent_color: "142.1 76.2% 36.3%"
theme_background: "0 0% 100%"
theme_background_type: "solid"
```

#### Feature Flags
```
feature_advanced_analytics: true
feature_ai_chat: true
feature_storage_manager: true
feature_real_time_updates: true
feature_experimental_ui: false
feature_maintenance_mode: false
```

#### Layout Settings
```
layout_sidebar_collapsed: false
layout_header_style: "default"
layout_max_width: "1200px"
layout_show_footer: true
```

#### Admin Settings
```
admin_items_per_page: 10
admin_auto_save: true
admin_debug_mode: false
admin_upload_timeout: 30000
```

### 3. Parameter Setup Steps

For each parameter above:

1. Click **Add parameter**
2. Enter the parameter key (e.g., `theme_primary_color`)
3. Set the default value
4. Click **Save**

### 4. Publish Configuration

1. After adding all parameters, click **Publish changes**
2. Add a description like "Initial Remote Config setup"
3. Click **Publish**

### 5. Test in Your App

1. Open your admin dashboard: `http://localhost:3001/admin`
2. Go to the **Remote Config** tab
3. You should see all your parameters with their values
4. Click **Refresh** to fetch the latest configuration

## Advanced Usage

### Conditional Parameters

You can create conditions for different parameter values:

1. **Development Mode**: Show debug features for specific users
2. **A/B Testing**: Different themes for different user segments
3. **Maintenance**: Enable maintenance mode for all users
4. **Regional Settings**: Different configurations per country

### Example Conditions

**Development Users**:
- Condition: `app.userProperty['role'] == 'developer'`
- Parameters: `admin_debug_mode: true`, `feature_experimental_ui: true`

**Maintenance Mode**:
- Condition: `app.timeOfDay >= 2 && app.timeOfDay <= 4`
- Parameters: `feature_maintenance_mode: true`

### Color Customization

The theme colors use HSL format for better control:

```
// Primary Brand Color (Blue)
theme_primary_color: "221.2 83.2% 53.3%"

// Success Color (Green)  
theme_accent_color: "142.1 76.2% 36.3%"

// Background (White/Dark)
theme_background: "0 0% 100%"      // Light mode
theme_background: "222.2 84% 4.9%" // Dark mode
```

### Feature Flags Usage

Control what features are visible:

```javascript
// In your components
const showAI = useFeatureFlag('ai_chat');
const debugMode = useFeatureFlag('debug_mode');

return (
  <div>
    {showAI && <AIChatComponent />}
    {debugMode && <DebugPanel />}
  </div>
);
```

## Real-time Updates

Your app automatically fetches Remote Config updates:

- **Fetch Interval**: Every 1 hour by default
- **Manual Refresh**: Click the refresh button in admin dashboard
- **Real-time**: Changes apply immediately when published

## Best Practices

1. **Test First**: Use conditions to test new values with specific users
2. **Gradual Rollout**: Use percentage-based targeting for major changes
3. **Backup Values**: Always set sensible default values in your code
4. **Documentation**: Document what each parameter controls
5. **Version Control**: Use meaningful descriptions when publishing changes

## Troubleshooting

**Parameters not updating?**
- Check internet connection
- Verify Firebase project ID matches
- Look for console errors in browser dev tools
- Try manual refresh in admin dashboard

**Colors not applying?**
- Ensure HSL format is correct: "hue saturation% lightness%"
- Check for CSS conflicts
- Verify the parameter name matches exactly

**Feature flags not working?**
- Confirm boolean values are `true`/`false` (not "true"/"false")
- Check component is using `useFeatureFlag` hook correctly
- Verify parameter name starts with `feature_`

---

🎉 **You're all set!** Your Remote Config should now be working. Visit the admin dashboard to see it in action!
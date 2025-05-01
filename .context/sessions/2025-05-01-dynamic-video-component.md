---
title: Dynamic Product Video Component Implementation
type: session
date: 2025-05-01T12:11:15-06:00
tags: [product-page, video-integration, shopify, component]
---

# Dynamic Product Video Component Implementation

## Summary
Implemented a new `ProductVideos` component that dynamically displays videos from Shopify product media with a "video-" prefix in the alt text. This replaces the previous fixed YouTube video embed with a flexible solution that pulls videos directly from each product's media.

## Changes Made

### 1. Created ProductVideos Component
- Developed a new `ProductVideos.tsx` component that filters product media for items with a "video-" prefix
- Implemented parsing logic to extract title, description, and video URL from alt text
- Added support for different video sources (YouTube, Vimeo, direct video files)
- Created responsive video containers with zigzag layout similar to the features section

### 2. Integrated with Product Page
- Added the component to `ProductPage.tsx`
- Implemented a fallback to the fixed YouTube video if no product videos are found
- Maintained consistent styling with other product sections

### 3. Video Source Handling
- Added support for YouTube, Vimeo, and direct video file URLs
- Implemented URL parsing to extract video IDs from various formats
- Created appropriate iframe embeds for each video source

## How to Add Videos to Products in Shopify

To add videos to a product using this component, follow these steps:

1. **Prepare the Video URL**:
   - For YouTube videos: Use the standard YouTube URL (e.g., `https://www.youtube.com/watch?v=VIDEO_ID`)
   - For Vimeo videos: Use the standard Vimeo URL (e.g., `https://vimeo.com/VIDEO_ID`)
   - For direct video files: Use the full URL to the video file

2. **Add an Image to the Product in Shopify**:
   - In the Shopify admin, go to the product you want to add a video to
   - Add a new image to the product's media gallery
   - This image will be used as a thumbnail or placeholder for the video

3. **Format the Alt Text**:
   - Set the alt text of the image using the following format:
   - `video-Title:Description:VideoURL`
   - Example: `video-Chair Assembly:Learn how to assemble your new chair:https://www.youtube.com/watch?v=abcd1234`

4. **Multiple Videos**:
   - You can add multiple videos by adding multiple images with the "video-" prefix
   - Each video will be displayed in the order they appear in the product media gallery
   - Videos will be displayed in a zigzag layout, alternating left and right

## Technical Details

The component works by:
1. Filtering product images for those with alt text starting with "video-"
2. Parsing the alt text to extract title, description, and video URL
3. Determining the video type (YouTube, Vimeo, or direct file)
4. Rendering the appropriate video embed
5. Displaying the videos in a responsive zigzag layout

If no videos are found (no images with "video-" prefix), the component will not render, and the fallback YouTube video will be shown instead.

## Next Steps
- Consider extending the Shopify GraphQL query to include proper media fields for videos
- Add more video source support (e.g., Wistia, Facebook)
- Implement video thumbnails and previews
- Add video analytics tracking

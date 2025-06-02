# Guide: Using Alt Text for Product Features & Specifications

This guide explains how to format the Alt Text for images in your Shopify product media gallery so they can be automatically displayed as feature or specification sections on the redesigned product page by the `ProductDetailSections.jsx` component.

## Purpose

The component identifies specific images meant to showcase product features or specifications by looking for special prefixes in their Alt Text. It then uses the rest of the Alt Text to generate a title and description for that section.

## Required Format

For an image to be picked up by the component, its Alt Text **must** start with one of the following prefixes:

*   `feature-` : Use this for images highlighting a product feature.
*   `spec-` : Use this for images detailing product specifications or dimensions.

Following the prefix, you should include a **Title** for the section, followed by a **colon (`:`)**, and then the **Description**.

**Format:** `prefix-Title:Description`

**Example Structure:**

```
feature-Your Feature Title:This is the detailed description of the feature shown in the image.
```

```
spec-Your Specification Title:This is the detailed description of the specification shown in the image.
```

## Examples

**Feature Example:**

*   **Image:** An image showing the adjustable lumbar support.
*   **Required Alt Text:** `feature-Soporte Lumbar Adaptativo:Nuestro soporte lumbar se ajusta en altura y profundidad para adaptarse perfectamente a la curva de tu espalda, promoviendo una postura saludable.`

**Specification Example:**

*   **Image:** An image displaying the chair's dimensions.
*   **Required Alt Text:** `spec-Dimensiones Detalladas:Altura total: 115-125 cm, Ancho del asiento: 52 cm, Profundidad: 48 cm. Consulta la imagen para más detalles.`

**Example with No Description (Optional):**

If you only want a title and no description text below the image, simply omit the colon and the description part.

*   **Image:** A close-up of the mesh material.
*   **Required Alt Text:** `feature-Malla Transpirable Premium`
    *   *(The component will display the title "Malla Transpirable Premium" but no description paragraph.)*

## Important Notes

*   **Prefixes are Key:** Images without Alt Text starting exactly with `feature-` or `spec-` will be ignored by the `ProductDetailSections` component (but will still appear in the main product gallery thumbnails unless filtered out there too, which we've done in `ProductHeroShowcase`).
*   **Colon Separator:** If you want both a title and a description, the colon (`:`) is crucial to separate them. The text before the first colon becomes the title, and everything after becomes the description.
*   **Consistency:** Use the prefixes and format consistently for all feature/specification images you want displayed in this section.
*   **Location:** Add this Alt Text to the images directly within the Shopify Admin panel when editing the product's media.


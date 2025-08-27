/**
 * Initializes the sandbox environment
 */

import '@/styles/index.scss';

import toggleLight from '@/images/toggle-light.svg';
import toggleDark from '@/images/toggle-dark.svg';

let controls = document.querySelector('.page-controls') as HTMLElement;
controls.style.userSelect = 'none';

const toggleButton = document.createElement('button');
toggleButton.classList.add('icon-button');

controls.append(toggleButton,);

const toggleIcon = document.createElement('img');
toggleIcon.draggable = false;
toggleButton.append(toggleIcon);

const updateTheme = (isDark: boolean) => {
    document.documentElement.classList.toggle('light-theme', !isDark);
    toggleIcon.src = isDark ? toggleLight : toggleDark;
};

toggleIcon.onclick = () => updateTheme(toggleIcon.src === toggleDark);

// Initialize theme if the user has specified light / dark, otherwise default to dark theme
if (window.matchMedia) {
    const darkSchemeMediaQuery = window.matchMedia('(prefers-color-scheme: dark)');
    darkSchemeMediaQuery.addEventListener('change', (e) => updateTheme(e.matches));
    updateTheme(darkSchemeMediaQuery.matches);
}

import { ExportTarget, Player, Scene, SceneMode, bundle, download, saveAs } from '@kurtbruns/vector';
import JSZip from "jszip";

(window as any).downloadSVG = (id: string) => {

    let element: any = document.getElementById(id);

    download(element as SVGSVGElement, `${id}.svg`, ExportTarget.FIGMA);
}

// Add export functionality to download button
Player.setDefaultDownloadCallback((scene: Scene) => {

    // Switch scene to export mode for consistent frame generation
    scene.setMode(SceneMode.Export);
    
    // Create a ZIP file to store all animation frames
    const zip = new JSZip();
    
    let count = 1;
    
    // Track if we're currently in a wait period (where frames are identical)
    let currentlyWaiting = false;
    
    // Store the first frame bundle during wait periods to avoid duplicates
    let frameBundle = null;

    // Callback called for each frame during export
    // isWait: true when animation type is 'wait' (no visual changes)
    const frameCallback = (isWait: boolean) => {

        if(isWait) {
            // Handle wait frames (periods where scene is static)
            if(currentlyWaiting) {
                // Already in a wait period - skip bundle generation, just increment counter
                // The visual content is identical to the previous frame
                count++;
            } else {
                // Starting a new wait period - generate bundle once and reuse it
                frameBundle = bundle(scene.frame.root, ExportTarget.BROWSER);
                zip.file(`frame${count++}.svg`, frameBundle);
                currentlyWaiting = true;
            }
        } else {
            // Handle active animation frames (visual changes occurring)

            // If we were just in a wait period, add the stored frame to ZIP
            // This means the first and last frame are the same for a wait period
            // For example, for a wait period of 30 frames (1 second for 30fps)
            // ...
            // frame30.svg
            // frame31.svg
            // frame60.svg
            // frame61.svg
            // ...
            //
            // Note: the gap is intentional, and is used to indicate the wait period
            if(currentlyWaiting) {
                zip.file(`frame${count - 1}.svg`, frameBundle);
                currentlyWaiting = false;
            }

            // Capture the current frame and add to ZIP
            zip.file(`frame${count++}.svg`, bundle(scene.frame.root, ExportTarget.BROWSER));
        }
    };


    scene
        .export(frameCallback)
        .then(() => {
            
            // If we were just in a wait period, add the stored frame to ZIP
            if(currentlyWaiting) {
                zip.file(`frame${count - 1}.svg`, frameBundle);
            }

            zip.generateAsync({ type: 'blob' }).then(function (content) {
                saveAs(content, `${scene.frame.getAttribute('id')}`, {});
            });
        })
        .catch((error) => {
            console.error('An error occurred:', error);
        })
});
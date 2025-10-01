import express from 'express';
import { authenticateToken } from '../middleware/auth.middleware.js';
import { updateNavigation, updateTheme, updateHeroDashboards } from '../controllers/admin.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   securitySchemes:
 *     bearerAuth:
 *       type: http
 *       scheme: bearer
 *       bearerFormat: JWT
 *   schemas:
 *     NavigationUpdate:
 *       type: object
 *       properties:
 *         navItems:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               id:
 *                 type: string
 *               name:
 *                 type: string
 *               key:
 *                 type: string
 *               href:
 *                 type: string
 *               position:
 *                 type: number
 *               hasDropdown:
 *                 type: boolean
 *               isActive:
 *                 type: boolean
 *         dropdownData:
 *           type: object
 *           additionalProperties:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               items:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     name:
 *                       type: string
 *                     href:
 *                       type: string
 *                     description:
 *                       type: string
 *                     features:
 *                       type: array
 *                       items:
 *                         type: string
 *     ThemeUpdate:
 *       type: object
 *       properties:
 *         primaryColor:
 *           type: string
 *           example: "#3b82f6"
 *         accentColor:
 *           type: string
 *           example: "#f97316"
 *         logoUrl:
 *           type: string
 *         companyName:
 *           type: string
 *           example: "Fortune Technologies"
 *     HeroDashboardUpdate:
 *       type: object
 *       properties:
 *         dashboards:
 *           type: array
 *           items:
 *             type: object
 *             properties:
 *               title:
 *                 type: string
 *               description:
 *                 type: string
 *               stats:
 *                 type: array
 *                 items:
 *                   type: object
 *                   properties:
 *                     label:
 *                       type: string
 *                     value:
 *                       type: string
 *                     color:
 *                       type: string
 *                       enum: [primary, accent]
 *               features:
 *                 type: array
 *                 items:
 *                   type: string
 */

/**
 * @swagger
 * /api/admin/navigation:
 *   put:
 *     summary: Update website navigation
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/NavigationUpdate'
 *     responses:
 *       200:
 *         description: Navigation updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Navigation updated successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.put('/navigation', authenticateToken, updateNavigation);

/**
 * @swagger
 * /api/admin/theme:
 *   put:
 *     summary: Update website theme configuration
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/ThemeUpdate'
 *     responses:
 *       200:
 *         description: Theme updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Theme updated successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.put('/theme', authenticateToken, updateTheme);

/**
 * @swagger
 * /api/admin/hero-dashboards:
 *   put:
 *     summary: Update hero dashboard slides
 *     tags: [Admin]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/HeroDashboardUpdate'
 *     responses:
 *       200:
 *         description: Hero dashboards updated successfully
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 message:
 *                   type: string
 *                   example: "Hero dashboards updated successfully"
 *       401:
 *         description: Unauthorized
 *       403:
 *         description: Forbidden
 *       500:
 *         description: Internal server error
 */
router.put('/hero-dashboards', authenticateToken, updateHeroDashboards);

export default router;

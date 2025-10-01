import express from 'express';
import { getNavigation } from '../controllers/navigation.controller.js';

const router = express.Router();

/**
 * @swagger
 * components:
 *   schemas:
 *     NavItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         key:
 *           type: string
 *         href:
 *           type: string
 *         position:
 *           type: number
 *         hasDropdown:
 *           type: boolean
 *         isActive:
 *           type: boolean
 *     DropdownItem:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         name:
 *           type: string
 *         href:
 *           type: string
 *         description:
 *           type: string
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         position:
 *           type: number
 *         isActive:
 *           type: boolean
 *     ThemeConfig:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         primaryColor:
 *           type: string
 *         accentColor:
 *           type: string
 *         logoUrl:
 *           type: string
 *         companyName:
 *           type: string
 *     HeroDashboard:
 *       type: object
 *       properties:
 *         id:
 *           type: string
 *         title:
 *           type: string
 *         description:
 *           type: string
 *         stats:
 *           type: array
 *           items:
 *             type: object
 *         features:
 *           type: array
 *           items:
 *             type: string
 *         position:
 *           type: number
 *     NavigationResponse:
 *       type: object
 *       properties:
 *         navItems:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/NavItem'
 *         dropdownData:
 *           type: object
 *         themeConfig:
 *           $ref: '#/components/schemas/ThemeConfig'
 *         heroDashboards:
 *           type: array
 *           items:
 *             $ref: '#/components/schemas/HeroDashboard'
 */

/**
 * @swagger
 * /api/navigation:
 *   get:
 *     summary: Get navigation data
 *     tags: [Navigation]
 *     responses:
 *       200:
 *         description: Navigation data retrieved successfully
 *         content:
 *           application/json:
 *             schema:
 *               $ref: '#/components/schemas/NavigationResponse'
 *       500:
 *         description: Internal server error
 */
router.get('/', getNavigation);

export default router;

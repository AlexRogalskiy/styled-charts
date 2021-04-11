import { RouteFunction } from '../../typings/service-types'
import { RoutePattern } from '../../typings/enum-types'
import { Optional } from '../../typings/standard-types'

import { defaultController } from '../controllers/default.controller'
import { rawController } from '../controllers/raw.controller'

/**
 * RouteRecord
 * @desc Type representing route config options
 */
export type RouteRecord = Record<RoutePattern, RouteFunction>

/**
 * Route mappings
 * @desc Type representing supported route mappings
 */
const routes: Readonly<RouteRecord> = {
    [RoutePattern.default]: defaultController,
    [RoutePattern.raw]: rawController,
}

/**
 * Returns {@link RouteFunction} by input {@link RoutePattern} value
 * @param value initial input {@link RoutePattern} to fetch by
 */
export const getRoute = (value: Optional<RoutePattern>): RouteFunction => {
    return value ? routes[value] : routes[RoutePattern.default]
}

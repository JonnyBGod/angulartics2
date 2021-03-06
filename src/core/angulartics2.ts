import {Injectable} from 'angular2/core';
import {ReplaySubject} from 'rxjs/subject/ReplaySubject';
import {Router, Location} from 'angular2/router';

@Injectable()
export class Angulartics2 {

	public settings: any = {
		pageTracking: {
			autoTrackVirtualPages: true,
			basePath: '',
			excludedRoutes: []
		},
		eventTracking: {},
		developerMode: false
	};

	/*
		@Param: ({url: string, location: Location})
	 */
	public pageTrack: ReplaySubject<any> = new ReplaySubject();

	/*
		@Param: ({action: any, properties: any})
	 */
	public eventTrack: ReplaySubject<any> = new ReplaySubject();

	/*
		@Param: (properties: any)
	 */
	public exceptionTrack: ReplaySubject<any> = new ReplaySubject();

	/*
		@Param: (alias: string)
	 */
	public setAlias: ReplaySubject<string> = new ReplaySubject();

	/*
		@Param: (userId: string)
	 */
	public setUsername: ReplaySubject<string> = new ReplaySubject();

	/*
		@Param: ({action: any, properties: any})
	 */
	public setUserProperties: ReplaySubject<any> = new ReplaySubject();

	/*
		@Param: (properties: any)
	 */
	public setUserPropertiesOnce: ReplaySubject<any> = new ReplaySubject();

	/*
		@Param: (properties: any)
	 */
	public setSuperProperties: ReplaySubject<any> = new ReplaySubject();

	/*
		@Param: (properties: any)
	 */
	public setSuperPropertiesOnce: ReplaySubject<any> = new ReplaySubject();

	/*
		@Param: (properties: any)
	 */
	public userTimings: ReplaySubject<any> = new ReplaySubject();

	constructor(router: Router, location: Location) {
		setTimeout(() => {
			this.spyRouter(router, location);
		});
	}

	spyRouter(router: Router, location: Location) {
		router.subscribe((route) => {
			if (!this.settings.developerMode) {
				setTimeout(() => {
					let url: string = location.prepareExternalUrl(route);
					if (this.settings.pageTracking.autoTrackVirtualPages && !this.matchesExcludedRoute(url)) {
						this.pageTrack.next({
							path: this.settings.pageTracking.basePath.lenght ? this.settings.pageTracking.basePath + route : location.prepareExternalUrl(url),
							location: location
						});
					}
				});
			}
		});

		if (!this.settings.developerMode) {
			if (this.settings.pageTracking.autoTrackVirtualPages && !this.matchesExcludedRoute(location.path())) {
				this.pageTrack.next({
					path: this.settings.pageTracking.basePath.lenght ? this.settings.pageTracking.basePath + location.path() : location.prepareExternalUrl(location.path()),
					location: location
				});
			}
		}
	}

	virtualPageviews(value: boolean) {
		this.settings.pageTracking.autoTrackVirtualPages = value;
	}
	excludeRoutes(routes: Array<string>) {
		this.settings.pageTracking.excludedRoutes = routes;
	}
	firstPageview(value: boolean) {
		this.settings.pageTracking.autoTrackFirstPage = value;
	}
	withBase(value: string) {
    this.settings.pageTracking.basePath = (value);
	}
	developerMode(value: boolean) {
		this.settings.developerMode = value;
	}

	private matchesExcludedRoute(url: string): boolean {
		for (let excludedRoute of this.settings.pageTracking.excludedRoutes) {
			if ((excludedRoute instanceof RegExp && excludedRoute.test(url)) || url.indexOf(excludedRoute) > -1) {
				return true;
			}
		}
		return false;
  }
}

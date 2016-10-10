import Ember from 'ember';

export default Ember.Mixin.create({
  perfTracking: Ember.inject.service('performance-tracking'),
  _actions: {
    /**
     * Schedule a function to call the endTransition function of the perfTracking service in afterRender run queue
     */
    didTransition: function() {
      var self = this;
      Ember.run.scheduleOnce('afterRender', function () {
        self.get('perfTracking').endTransition(self.routeName, self.get('router.url'));
      });
      const result = this._super.apply(this, arguments);
      if (typeof result === "undefined") {
        return true;
      } else {
        return result;
      }
    },
    willTransition: function() {
      var originRoute = this.get('routeName');
      this.get('perfTracking').startTransition(originRoute);
      const result = this._super.apply(this, arguments);
      // result may be true, false, some Object, undefined
      // result is undefined if:
      // 1. no handler for willTransition in current route
      // 2. handler intentionally return undefined
      //
      // in case 1 we should return true instead of undefined
      // and send event to next route
      // in case 2 we should change handler
      if (typeof result === "undefined") {
        return true;
      } else {
        return result;
      }
    }
  }
});

import Ember from 'ember';

export default Ember.Mixin.create({
  perfTracking: Ember.inject.service('performance-tracking'),

  didTransition() {
    this._super(...arguments);

    // Ensure `url` has been updated.
    Ember.run.next(this, function() {
      this.get('perfTracking').endTransition(
        this.get('currentRouteName'),
        this.get('url')
      );
    });
  },

  willTransition() {
    var originRoute = this.get('routeName');
    this.get('perfTracking').startTransition(originRoute);

    this._super(...arguments);
  }
});

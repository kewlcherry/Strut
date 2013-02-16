define(['libs/backbone',
		'bundles/slide_snapshot/SlideSnapshot',
		'common/Throttler',
		'./WellContextMenu',
		'css!styles/slide_editor/slideWell.css'],
function(Backbone, SlideSnapshot, Throttler, WellContextMenu, empty) {
	'use strict';

	return Backbone.View.extend({
		events: {
			mousemove: '_showContextMenu',
			mouseleave: '_hideContextMenu'
		},

		className: 'slideWell',

		initialize: function() {
			this._deck.on('slideAdded', this._slideAdded, this);
			this._doShowContextMenu = this._doShowContextMenu.bind(this);
			this._throttler = new Throttler(100);
			this._contextMenu = new WellContextMenu(this._editorModel);
			this._contextMenu.render();
		},

		_showContextMenu: function(e) {
			//if (e.target != this.$el[0]) return;
			this._throttler.submit(this._doShowContextMenu, {
				rejectionPolicy: 'runLast',
				arguments: [e]
			});
		},

		_hideContextMenu: function(e) {
			if (e.target == this.$el[0]) {
				this._throttler.cancel();
				this._contextMenu.hide();
			}
		},

		_doShowContextMenu: function(e) {
			var offsetY = e.pageY - this.$el.offset().top;
			// if (offsetY == null)
				// offsetY = e.originalEvent.layerY;

			var newPos = (((offsetY+40) / 100) | 0) * 100;
			this._contextMenu.reposition({x: this.$el.width() / 2 - this._contextMenu.$el.width() / 2, y: newPos});
		},

		_slideAdded: function(slide, index) {
			// Append it in the correct position in the well
		},

		render: function() {
			this.$el.html('');
			this._deck.get('slides').forEach(function(slide) {
				var snapshot = new SlideSnapshot({model: slide, deck: this._deck, registry: this._registry});
				this.$el.append(snapshot.render().$el);
			}, this);
			this.$el.append(this._contextMenu.$el);
			return this;
		},

		constructor: function SlideWell(editorModel) {
			this._deck = editorModel.deck();
			this._registry = editorModel.registry;
			this._editorModel = editorModel;
			Backbone.View.prototype.constructor.call(this);
		}
	});
});
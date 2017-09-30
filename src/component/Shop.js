/**
 * This is the primary file you need to modify for the workshop. It's quite
 * large because it does a lot of things but parts you need to modify should be
 * clearly marked. You can search this file for `WORKSHOP` or `TODO` to see
 * important locations in the code.
 */

/* eslint-disable no-alert */

import React from 'react';
import {propEq, find, pathOr} from 'ramda';
import cuid from 'cuid';

import Fuse from 'fuse.js';

import {sendEvent} from '../analytics';
import {getLocation, getEnvironmentData} from '../util';

const PRODUCTS_URL = 'https://d1a53kk9vq669t.cloudfront.net/products.json';

const PAGE_SIZE = 6;

const TYPE_COLORS = {
  poison: {bg: '#A33EA1', fg: '#fff'},
  grass: {bg: '#7AC74C', fg: '#fff'},
  fire: {bg: '#EE8130', fg: '#fff'},
  flying: {bg: '#A98FF3', fg: '#fff'},
  water: {bg: '#6390F0', fg: '#fff'},
  bug: {bg: '#A6B91A', fg: '#fff'},
  normal: {bg: '#A8A77A', fg: '#fff'},
  electric: {bg: '#F7D02C', fg: '#fff'},
  ground: {bg: '#E2BF65', fg: '#fff'},
  fairy: {bg: '#D685AD', fg: '#fff'},
  fighting: {bg: '#C22E28', fg: '#fff'},
  psychic: {bg: '#F95587', fg: '#fff'},
  rock: {bg: '#B6A136', fg: '#fff'},
  steel: {bg: '#B7B7CE', fg: '#fff'},
  ice: {bg: '#96D9D6', fg: '#fff'},
  ghost: {bg: '#735797', fg: '#fff'},
  dragon: {bg: '#6F35FC', fg: '#fff'},
  dark: {bg: '#705746', fg: '#fff'},
};

const formatPrice = (v) => {
  return v.toLocaleString('en-US', {
    style: 'currency',
    currency: 'USD',
  });
};

const getTotal = (cart) => {
  return cart.reduce(
    (t, {quantity, price}) => t + (quantity * price),
    0
  );
};

/**
 * Simple shopping experience.
 *
 */
class Shop extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      loading: false,
      // Whether to display the shopping experience or not.
      shopping: false,

      // =======================================================================
      // User info.
      // =======================================================================
      // This includes various user information and you can use it in your
      // analytics events.
      user: {
        /**
         * Gender of the user. Either `male`, `female` or `other`.
         * @type {String}
         */
        gender: 'male',
        /**
         * Age of the user.
         * @type {Number}
         */
        age: 22,
        /**
         * Where the user is located as a geopoint.
         * @type {Object}
         */
        location: {lat: 49.2827, lon: -123.1207},
      },

      // =======================================================================
      // Envrionment info.
      // =======================================================================
      // This includes various browser information and you can use it in your
      // analytics events.
      env: getEnvironmentData(),

      // =======================================================================
      // Cart info.
      // =======================================================================
      /**
       * Unique id for the cart. Is regenerated every time the cart is cleared
       * by checkout or via the user.
       * @type {String}
       */
      cartId: cuid(),
      /**
       * Array of items that are in the cart. Includes full item information
       * as well as a `quantity` property.
       * @type {Array}
       */
      cart: [],

      // =======================================================================
      // Product info.
      // =======================================================================
      products: [],
      pageOffset: 0,
      query: '',
      searchQuery: '',
    };
  }

  /**
   * This function is responsible for sending all analytics events through the
   * system. Every action (e.g. `checkout`) calls this when an event needs to
   * be sent. This is your opportunity to add data that is common to all of
   * your events. For example if you want to associate browser data with your
   * events then this is where you would do it.
   * @param {String} event Name of event to send.
   * @param {Object} data Data associated with the event.
   * @returns {Promise} Result of sending the event.
   */
  sendEvent(event, data) {
    const {base} = this.props;
    return sendEvent(base, event, {
      ...data,
      // ===============================================================
      // WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP
      // ===============================================================
      // You have access to `this.state` which is documented at the top of the
      // class and has information about things like the current user and the
      // current cart.
      ...this.state.user,
      ...this.state.env,
      cartId: this.state.cartId,
    });
  }

  // ===========================================================================
  // Store user actions
  // ===========================================================================

  /**
   * Add an item to the cart. This function is called whenever the "Add to Cart"
   * button is clicked in the UI.
   * @param {String} id The id of the item to add.
   * @returns {void}
   */
  addToCart(id) {
    const {products, cart} = this.state;
    const matchesId = propEq('id', id);
    const product = find(matchesId, products);
    if (product) {
      // Walk through the cart and find if the item already exists. If it does
      // then increase its quantity by 1.
      const newCart = cart.slice();
      let found = false;
      newCart.forEach((item) => {
        if (matchesId(item)) {
          ++item.quantity;
          found = true;
        }
      });
      // If it does not exist in the cart already then add it to the cart with
      // an initial quantity of 1.
      if (!found) {
        newCart.push({
          ...product,
          quantity: 1,
        });
      }
      this.setState({
        cart: newCart,
      });
      // ===============================================================
      // WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP
      // ===============================================================
      // This function is responsible for sending an analytics event whenever
      // someone adds an item to their cart. You can control what data you
      // send out along with this event. The `product` object here has all
      // the properties of the item being added to cart. Additionally you have
      // access to all of `this.state` which is documented at the top of the
      // class.
      this.sendEvent('addToCart', {
        attack: product.attack,
        defense: product.defense,
        type: product.type,
        price: product.price,
        cost: product.quantity * product.price,
        id: product.id,
      });
    }
  }

  /**
   * Perform a checkout. This function is called whenever the user clicks the
   * "Checkout" button in the UI. Note that on a real site you would be prompted
   * for payment information and so forth – our little test app simply clears
   * the cart and does nothing more.
   * @returns {void}
   */
  checkout() {
    // ===============================================================
    // WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP * WORKSHOP
    // ===============================================================
    // This function is responsible for sending an analytics event whenever
    // someone clicks the `checkout` button. You can control what data you
    // send out along with this event.
    this.sendEvent('checkout', {
      items: this.state.cart.map(({id}) => id),
      total: getTotal(this.state.cart),
    });

    // Clear the cart. A real app would do more here.
    this.clearCart();
  }

  /**
   * Clear the cart. This function is called whenever the user clicks the
   * "Clear Cart" button in the UI.
   * @returns {void}
   */
  clearCart() {
    this.setState({
      cart: [],
      cartId: cuid(),
    });
  }

  /**
   * Start the shopping experience. Called when the user clicks "Start Shopping"
   * in the UI.
   * @returns {void}
   */
  start() {
    this.loadProducts();
    this.setState({
      shopping: true,
    });
  }

  // ===========================================================================
  // User functions
  // ===========================================================================

  /**
   * Save the user's information to local storage. Called after the user data is
   * updated.
   * @returns {void}
   */
  saveProfile() {
    localStorage.setItem('slam-profile', JSON.stringify(this.state.user));
  }

  /**
   * Restore the user's data from local storage. Called when the app first loads
   * and used to hydrate the user form fields.
   * @returns {void}
   */
  loadProfile() {
    try {
      const user = JSON.parse(localStorage.getItem('slam-profile'));
      if (user) {
        this.setState({user});
        return true;
      }
    } catch (_err) {
      // Do nothing.
    }
    return false;
  }

  /**
   * Update the user profile information with specific data. This is called
   * when the user form field is modified. It saves the resulting data to
   * local storage after.
   * @param {Object} data New user data to save.
   * @returns {void}
   */
  updateUser(data) {
    this.setState({
      user: {
        ...this.state.user,
        ...data,
      },
    }, () => this.saveProfile());
  }

  // ===========================================================================
  // Product functions
  // ===========================================================================

  /**
   * Load the list of products from the internet.
   * @returns {void}
   */
  loadProducts() {
    this.setState({loading: true});

    fetch(PRODUCTS_URL)
      .then((response) => response.json())
      .then((products) => {
        this.products = products;
        this.fuse = new Fuse(products, {
          shouldSort: true,
          threshold: 0.3,
          location: 0,
          distance: 100,
          maxPatternLength: 32,
          minMatchCharLength: 1,
          keys: ['name'],
        });
        this.search();
      });
  }

  /**
   * Search for a specific product. Called when the user types in the search
   * field in the UI.
   * @param {String} text The text to search for.
   * @returns {void}
   */
  search(text) {
    const products = text && this.fuse
      ? this.fuse.search(text)
      : this.products;

    this.setState({products, searchQuery: text || '', pageOffset: 0});
  }

  /**
   * View the next set of product results. Called when the user clicks the
   * "Next" button in the UI.
   * @returns {void}
   */
  next() {
    this.setState({
      pageOffset: Math.min(this.state.pageOffset + 1, this.getMaxPageOffset()),
    });
  }

  /**
   * View the previous set of product results. Called when the user clicks the
   * "Previous" button in the UI.
   * @returns {void}
   */
  previous() {
    this.setState({
      pageOffset: Math.max(this.state.pageOffset - 1, 0),
    });
  }

  /**
   * Get the index of the last page. Used for clamping the "Next" button.
   * @returns {Number} Index of the last page.
   */
  getMaxPageOffset() {
    return Math.floor(this.state.products.length / PAGE_SIZE);
  }

  // ===========================================================================
  // React lifecycle functions
  // ===========================================================================

  componentWillMount() {
    // If the user has an existing profile then just use the data from that.
    if (this.loadProfile()) {
      return;
    }
    // Otherwise try to detect the user's location and set that.
    getLocation().then(
      ({coords}) => {
        this.updateUser({
          location: {lat: coords.latitude, lon: coords.longitude},
        });
      }
    );
  }

  // ===========================================================================
  // Render functions
  // ===========================================================================

  /**
   * Renders the search field used for finding particular products.
   * @returns {React.Element} Search element.
   */
  renderSearch() {
    const {query} = this.state;
    return (
      <div className='input-group'>
        <input
          className='form-control'
          type='search'
          placeholder='Search'
          value={query}
          onChange={(ev) => {
            this.setState({query: ev.target.value});
          }}
          onKeyDown={(ev) => {
            if (ev.key === 'Enter') {
              this.search(this.state.query);
              ev.preventDefault();
            }

            if (ev.key === 'Escape') {
              this.setState({query: ''});
              this.search();
              ev.preventDefault();
            }
          }}
        />
        {this.state.query && this.state.searchQuery === this.state.query &&
          <span className='input-group-btn'>
            <button
              className='btn btn-danger'
              onClick={() => {
                this.setState({query: ''});
                this.search();
              }}
            >
              Clear
            </button>
          </span>
        }
        {this.state.searchQuery !== this.state.query &&
          <span className='input-group-btn'>
            <button
              className='btn btn-secondary'
              onClick={() => {
                this.search(this.state.query);
              }}
            >
              Search
            </button>
          </span>
        }
      </div>
    );
  }

  /**
   * Render the products grid. This grid has all the current products along with
   * their image and price and the "Add to Cart" button.
   * @returns {React.Element} Products element.
   */
  renderProducts() {
    const {products, pageOffset} = this.state;

    const start = pageOffset * PAGE_SIZE;
    const end = start + PAGE_SIZE;

    return (
      <div className='row'>
        {products.slice(start, end).map((product) => (
          <div key={product.id} className='col-12 col-lg-6 col-xl-4 mt-3'>
            <div className='card text-center'>
              <p className='badge badge-dark'>
                {formatPrice(product.price)}
              </p>
              <div className='p-1'>
                {product.type.map((type) => (
                  <div
                    className='badge ml-1 mr-1'
                    key={type}
                    style={{
                      display: 'inline-block',
                      backgroundColor: TYPE_COLORS[type].bg,
                      color: TYPE_COLORS[type].fg,
                    }}
                  >
                    {type}
                  </div>
                ))}
              </div>
              <div className='p-3'>
                <img
                  className='card-img-top'
                  src={product.img}
                  alt={product.name}
                />
              </div>
              <div className='card-body'>
                <h4 className='card-title'>{product.name}</h4>
                <table className='table'>
                  <tbody>
                    <tr>
                      <th role='row'>Attack</th>
                      <td>{product.attack}</td>
                    </tr>
                    <tr>
                      <th role='row'>Defense</th>
                      <td>{product.defense}</td>
                    </tr>
                  </tbody>
                </table>
                <button
                  className='btn btn-outline-primary'
                  onClick={(ev) => {
                    ev.preventDefault();
                    this.addToCart(product.id);
                  }}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    );
  }

  /**
   * Render the pagination element for going between pages in the product search
   * results.
   * @returns {React.Element} Pagination element.
   */
  renderPagination() {
    return (
      <div className='d-flex justify-content-between mt-3'>
        <button
          className='btn btn-outline-secondary'
          onClick={() => this.previous()}
          disabled={this.state.pageOffset === 0}
        >
          Previous
        </button>
        <button
          className='btn btn-outline-secondary'
          onClick={() => this.next()}
          disabled={this.state.pageOffset === this.getMaxPageOffset()}
        >
          Next
        </button>
      </div>
    );
  }

  /**
   * Render the cart. The cart contains a table of all the products that the
   * user has added to their cart along with the costs and the total cost of
   * everything in the cart.
   * @returns {React.Element} Cart element.
   */
  renderCart() {
    const {cart} = this.state;
    const total = getTotal(cart);
    return (
      <div className='mt-3'>
        {cart.length <= 0 && (
          <div className='alert alert-warning'>
            Your cart is empty.
          </div>
        )}
        {cart.length > 0 && (
          <table className='table table-striped'>
            <thead className='thead-inverse'>
              <tr>
                <th>Qty</th>
                <th>Item</th>
                <th>Cost</th>
              </tr>
            </thead>
            <tbody>
              {cart.map((item, i) => (
                <tr key={i}>
                  <td>{item.quantity}</td>
                  <td>{item.name}</td>
                  <td>{formatPrice(item.price * item.quantity)}</td>
                </tr>
              ))}
            </tbody>
            <tfoot>
              <tr>
                <th colSpan={2}>Total</th>
                <th>{formatPrice(total)}</th>
              </tr>
            </tfoot>
          </table>
        )}
        <div className='row no-gutters'>
          <div className='col-6 pr-1'>
            <button
              className='btn btn-block btn-outline-danger'
              onClick={(ev) => {
                ev.preventDefault();
                this.clearCart();
              }}
            >
              Clear
            </button>
          </div>
          <div className='col-6 pl-1'>
            <button
              disabled={cart.length <= 0}
              className='btn btn-block btn-success'
              onClick={(ev) => {
                ev.preventDefault();
                this.checkout();
              }}
            >
              Checkout
            </button>
          </div>
        </div>
      </div>
    );
  }

  /**
   * Render the user form. This form is designed to collect information about
   * the user so that analytics data can be augmented with this information. If
   * you wanted to collected more information from users this is where you
   * would do it.
   * @returns {React.Element} Form element.
   */
  renderForm() {
    return (
      <form>
        <div className='row'>
          <div className='col-6 col-md-2'>
            <div className='form-group'>
              <label>Age</label>
              <input
                className='form-control'
                type='number'
                min='13'
                max='100'
                value={pathOr('', ['user', 'age'], this.state)}
                onChange={(ev) => {
                  this.updateUser({
                    age: parseInt(ev.target.value, 10),
                  });
                }}
              />
            </div>
          </div>
          <div className='col-6 col-md-3'>
            <div className='form-group'>
              <label>Gender</label>
              <select
                className='form-control'
                type='text'
                value={pathOr('', ['user', 'gender'], this.state)}
                onChange={(ev) => {
                  this.updateUser({
                    gender: ev.target.value,
                  });
                }}
              >
                <option value='male'>Male</option>
                <option value='female'>Female</option>
                <option value='other'>Other</option>
              </select>
            </div>
          </div>
          <div className='col-6 col-md-4'>
            <label>Location</label>
            <div className='pt-2 bt-2'>
              {pathOr(0, ['user', 'location', 'lat'], this.state).toFixed(3)}°,
              {' '}
              {pathOr(0, ['user', 'location', 'lon'], this.state).toFixed(3)}°
            </div>
          </div>
          <div className='col-6 col-md-3'>
            <label/>
            <button
              className='btn btn-block btn-primary'
              onClick={(ev) => {
                ev.preventDefault();
                this.start();
              }}
            >
              Start Shopping
            </button>
          </div>
        </div>
      </form>
    );
  }

  /**
   * Render the entire component together. This is mostly just a composition of
   * other render calls.
   * @returns {React.Element} Overall component element.
   */
  render() {
    const {shopping} = this.state;
    if (!shopping) {
      return (
        <div>
          {this.renderForm()}
        </div>
      );
    }
    return (
      <div>
        <div className='row'>
          <div className='col-12'>
            {this.renderSearch()}
          </div>
        </div>
        <div className='row'>
          <div className='col-12 col-md-6 col-lg-8'>
            {this.renderProducts()}
            {this.renderPagination()}
          </div>
          <div className='col-12 col-md-6 col-lg-4'>
            {this.renderCart()}
          </div>
        </div>
      </div>
    );
  }
}

export default Shop;

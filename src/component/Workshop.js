import React from 'react';
import Shop from './Shop';
import Client from './Client';

class Workshop extends React.Component {
  render() {
    const {base} = this.props;
    return (
      <div>
        <h3>Workshop</h3>
        <p>
          It's time to go Pokémon™ shopping!
          We have created a simple cart application to which you will be able
          to add analytics events for your users. Your tasks are as follows:
        </p>
        <ul>
          <li>
            Create mappings for{' '}
            <code>checkout</code> and <code>addToCart</code>{' '}
            events and setup those mappings in your index. These work the
            same way a <code>pageview</code> mapping does that we setup
            earlier in the tutorial. It's up to you what info you want to
            include in your mappings.
          </li>
          <li>
            Fire events with data when "Add to Cart" and "Checkout"
            buttons care clicked. There are <code>TODO</code> markers in the
            code where you should be doing this. You can look at the{' '}
            <code>component/Tutorial.js</code> file for code on how to do this.
            The <strong>ONLY</strong> file you <i>need</i> to modify is{' '}
            <code>component/Shop.js</code> though you're free to tinker with
            other ones if you feel the desire to.
          </li>
          <li>
            Create visualizations (and optionally a corresponding dashboard)
            that shows a) total revenue for the store and b) the most popular
            types of pokemon. Bonus points for including other interesting data.
          </li>
        </ul>
        <p>
          <strong>IMPORTANT</strong>: If you don't see any events in Kibana
          make sure you've set the time view to "Today". Check to make sure
          events are going to the correct index and that you've refreshed
          Kibana's view of the index you are using.
        </p>
        <hr/>
        <p>
          Below is a simple browser-based REST client for communicating with
          your index. You can use it to setup your mapping, add events
          manually and so forth. You can use <code>curl</code> or another HTTP
          client instead if you would rather.
        </p>
        <Client base={base}/>
        <hr/>
        <Shop base={base}/>
      </div>
    );
  }
}

export default Workshop;

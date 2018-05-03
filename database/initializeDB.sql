CREATE TABLE users (
  user_id bigserial PRIMARY KEY,
  email varchar UNIQUE NOT NULL,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL
);

CREATE TABLE wishlist_items (
  wishlist_item_id bigserial PRIMARY KEY,
  item text NOT NULL,
  description text
);

CREATE TABLE users_wishlist_items (
  user_id bigint REFERENCES users,
  wishlist_item_id bigint REFERENCES wishlist_items
);

CREATE TABLE groups (
  group_id bigserial PRIMARY KEY,
  group_name text UNIQUE NOT NULL,
  description text,
  spend_min_pennies integer NOT NULL DEFAULT 0,
  spend_max_pennies integer NOT NULL,
  CHECK (spend_min_pennies >= 0 AND spend_max_pennies >= spend_min_pennies)
  -- group may be long term and have a gift exchange once a year, group may not have a date at all and do it all through the mail, etc.
  -- TODO: possibly add pairings_made bool for quick check if group is essentially 'closed' until exchange date.
);

CREATE TABLE users_groups (
  user_id bigint REFERENCES users,
  group_id bigint REFERENCES groups,
  PRIMARY KEY (user_id, group_id)
);

CREATE TABLE gift_exchanges (
  gift_exchange_id bigserial PRIMARY KEY,
  exchange_name text NOT NULL,
  group_id bigint REFERENCES groups,
  exchange_type text NOT NULL DEFAULT 'scheduled_in_person'
    CHECK (exchange_type in ('scheduled_in_person', 'scheduled_remote'))
);

CREATE TABLE scheduled_in_person_gift_exchanges (
  scheduled_in_person_gift_exchange_id bigserial PRIMARY KEY,
  exchange_type text NOT NULL DEFAULT 'scheduled_in_person'
    CHECK (exchange_type = 'scheduled_in_person'),
  gift_exchange_id bigint REFERENCES gift_exchanges UNIQUE,
  location text NOT NULL,
  -- alternatively could add a locations table and:
  -- location_id bigint REFERENCES locations NOT NULL,
  -- for GPS location, proper addresses, etc...
  scheduled_for timestamp with time zone NOT NULL
);

CREATE TABLE pairings (
  pairing_id bigserial PRIMARY KEY,
  group_id bigint,
  gift_exchange_id bigint REFERENCES gift_exchanges,
  giver_id bigint,
  receiver_id bigint,
  CHECK (giver_id <> receiver_id),
  FOREIGN KEY (giver_id, group_id) REFERENCES users_groups (user_id, group_id),
  FOREIGN KEY (receiver_id, group_id) REFERENCES users_groups (user_id, group_id),
  UNIQUE (gift_exchange_id, group_id, giver_id),
  UNIQUE (gift_exchange_id, group_id, receiver_id)
);
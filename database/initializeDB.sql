\c gift_exchange_db

CREATE TABLE users (
  user_id bigserial PRIMARY KEY,
  email varchar UNIQUE NOT NULL,
  password text NOT NULL,
  first_name text NOT NULL,
  last_name text NOT NULL
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

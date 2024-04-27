import React from 'react';
import { List, ListItem, Link } from '@mui/material';

const links = [
  { href: 'https://github.com/Mihaiii/semantic-autocomplete', title: 'GitHub' },
  { href: 'https://www.npmjs.com/package/semantic-autocomplete', title: 'npm' },
  { href: 'https://huggingface.co/Mihaiii/gte-micro', title: 'Model' },
  { href: 'https://mihaiii.github.io/semantic-autocomplete/', title: 'Demo' },
];

const HorizontalLinkList = () => {
  const listStyle = {
    display: 'flex',
    flexDirection: 'row',
    padding: 0
  };

  return (
    <List style={listStyle}>
      {links.map((link, index) => (
        <React.Fragment key={link.href}>
          <ListItem >
            <Link href={link.href} target="_blank">
              {link.title}
            </Link>
          </ListItem>
        </React.Fragment>
      ))}
    </List>
  );
};

export default HorizontalLinkList;
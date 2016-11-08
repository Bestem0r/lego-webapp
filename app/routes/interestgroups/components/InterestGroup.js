import styles from './InterestGroup.css';
import React, { Component } from 'react';
import Image from 'app/components/Image';
import { getImage } from 'app/utils';
import { Link } from 'react-router';

class InterestGroup extends Component {
  state = {
    editorOpen: false,
    memberCount: Math.floor((Math.random() * 10) + 1)
  };

  render() {
    return (
      <div className={styles.interestGroup}>
        <Link to={`/interestgroups/${this.props.group.id}`} className={styles.link}>
          <h2 className={styles.heading}>{this.props.group.name}</h2>
        </Link>
        <div className={styles.content}>
          <div className={styles.paragraph}>
            <p>{this.props.group.descriptionLong}</p>
            <p className={styles.bold}>
              Antall medlemmer i {this.props.group.name}: {this.state.memberCount}
            </p>
          </div>
          <Image className={styles.interestPic} src={getImage(this.props.group.id)} />
        </div>
      </div>
    );
  }
}

export default InterestGroup;

/* eslint-disable */
import React from 'react';
import { NextPage, NextPageContext } from 'next';

interface ErrorProps {
  statusCode: number | undefined;
}

const ErrorPage: NextPage<ErrorProps> = ({ statusCode }) => {
  return (
    <div style={{ padding: '100px 20px', textAlign: 'center' }}>
      <h1>
        {statusCode
          ? `An error occurred on server: ${statusCode}`
          : 'An error occurred on client'}
      </h1>
      <p>
        {statusCode === 404
          ? "The page you are looking for doesn't exist."
          : 'Sorry, we encountered an error. Please try again.'}
      </p>
    </div>
  );
};

ErrorPage.getInitialProps = ({ res, err }: NextPageContext): ErrorProps => {
  const statusCode = res ? res.statusCode : err ? err.statusCode : 404;
  return { statusCode };
};

export default ErrorPage;

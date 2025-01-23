import React from 'react'
import Link from "next/link";
import FormSignup from '@/components/demo/auth/FormSignup';
import NavbarComponents from '@/components/layouts/NavbarComponents';

const signupPage = () => {
  return (
    <section>
      <NavbarComponents />
      <div className="mx-auto max-w-6xl px-4 sm:px-6">
        <div className="py-12 md:py-20">
          <form className="mx-auto max-w-[400px]">
            <FormSignup
              PlaceholderName="Your name"
              PlaceholderEmail="Your email"
              PlaceholderPassword="Your password"
              PlaceholderKonfirmPassword="Confirm your password"
            />
          </form>
        </div>
      </div>
    </section>
  );
}

export default signupPage

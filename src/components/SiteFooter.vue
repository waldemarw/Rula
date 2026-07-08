<template>
  <footer class="site-footer">
    <div class="container site-footer__inner">
      <nav aria-label="Footer">
        <RouterLink to="/">Assessments</RouterLink>
        <RouterLink to="/about">About RULA</RouterLink>
        <RouterLink to="/contact">Contact</RouterLink>
        <RouterLink to="/contact?topic=feedback">Give feedback</RouterLink>
      </nav>
      <p>
        RULA scores a snapshot of working posture as part of a rapid screening process. Refer to
        the original methodology — McAtamney, L. and Corlett, E.N., "RULA: a survey method for the
        investigation of work-related upper limb disorders", Applied Ergonomics 1993, 24(2), 91–99
        — to check the correct use of the scores. No responsibility is taken for the use of this
        software.
      </p>
      <p>© {{ new Date().getFullYear() }} rula.co.uk — free online RULA assessment.</p>
    </div>
  </footer>
</template>

--
-- PostgreSQL database dump
--

-- Dumped from database version 17.2 (Debian 17.2-1.pgdg120+1)
-- Dumped by pg_dump version 17.2 (Debian 17.2-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET transaction_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

SET default_tablespace = '';

SET default_table_access_method = heap;

--
-- Name: bookmarks; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.bookmarks (
    id integer NOT NULL,
    post_id integer,
    profile_id integer,
    created_at timestamp with time zone DEFAULT now()
);


ALTER TABLE public.bookmarks OWNER TO callumburnsoregan;

--
-- Name: bookmarks_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.bookmarks_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.bookmarks_id_seq OWNER TO callumburnsoregan;

--
-- Name: bookmarks_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.bookmarks_id_seq OWNED BY public.bookmarks.id;

--
-- Name: likes; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.likes (
    id integer NOT NULL,
    post_id integer,
    profile_id integer
);


ALTER TABLE public.likes OWNER TO callumburnsoregan;

--
-- Name: likes_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.likes_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.likes_id_seq OWNER TO callumburnsoregan;

--
-- Name: likes_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.likes_id_seq OWNED BY public.likes.id;


--
-- Name: permissions; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.permissions (
    user_id integer,
    permissions text[] DEFAULT ARRAY[]::text[]
);


ALTER TABLE public.permissions OWNER TO callumburnsoregan;

--
-- Name: posts; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.posts (
    id integer NOT NULL,
    profile_id integer NOT NULL,
    parent_id integer,
    content text NOT NULL,
    media_url text,
    created_at timestamp with time zone DEFAULT now() NOT NULL,
    like_count integer DEFAULT 0,
    bookmark_count integer DEFAULT 0
);


ALTER TABLE public.posts OWNER TO callumburnsoregan;

--
-- Name: posts_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.posts_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.posts_id_seq OWNER TO callumburnsoregan;

--
-- Name: posts_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.posts_id_seq OWNED BY public.posts.id;


--
-- Name: profiles; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.profiles (
    id integer NOT NULL,
    display_name text NOT NULL,
    avatar_url text,
    location text,
    bio text,
    website text,
    joined_at timestamp with time zone DEFAULT now(),
    is_private boolean DEFAULT false,
    cover_image_url text
);


ALTER TABLE public.profiles OWNER TO callumburnsoregan;

--
-- Name: profiles_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.profiles_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.profiles_id_seq OWNER TO callumburnsoregan;

--
-- Name: profiles_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.profiles_id_seq OWNED BY public.profiles.id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: callumburnsoregan
--

CREATE TABLE public.users (
    id integer NOT NULL,
    email text NOT NULL,
    username text NOT NULL,
    password_hash text NOT NULL,
    created_at timestamp with time zone DEFAULT now(),
    first_name text DEFAULT 'Not Specified'::text NOT NULL,
    last_name text DEFAULT 'Not Specified'::text NOT NULL,
    phone_ext numeric DEFAULT '0'::numeric NOT NULL,
    phone_number text DEFAULT 'Not Specified'::text NOT NULL,
    birthday date DEFAULT now() NOT NULL
);


ALTER TABLE public.users OWNER TO callumburnsoregan;

--
-- Name: users_id_seq; Type: SEQUENCE; Schema: public; Owner: callumburnsoregan
--

CREATE SEQUENCE public.users_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER SEQUENCE public.users_id_seq OWNER TO callumburnsoregan;

--
-- Name: users_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: callumburnsoregan
--

ALTER SEQUENCE public.users_id_seq OWNED BY public.users.id;


--
-- Name: bookmarks id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks ALTER COLUMN id SET DEFAULT nextval('public.bookmarks_id_seq'::regclass);


--
-- Name: likes id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes ALTER COLUMN id SET DEFAULT nextval('public.likes_id_seq'::regclass);


--
-- Name: posts id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.posts ALTER COLUMN id SET DEFAULT nextval('public.posts_id_seq'::regclass);


--
-- Name: profiles id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.profiles ALTER COLUMN id SET DEFAULT nextval('public.profiles_id_seq'::regclass);


--
-- Name: users id; Type: DEFAULT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.users ALTER COLUMN id SET DEFAULT nextval('public.users_id_seq'::regclass);


--
-- Name: bookmarks_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.bookmarks_id_seq', 28, true);


--
-- Name: likes_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.likes_id_seq', 30, true);


--
-- Name: posts_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.posts_id_seq', 31, true);


--
-- Name: profiles_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.profiles_id_seq', 1, false);


--
-- Name: users_id_seq; Type: SEQUENCE SET; Schema: public; Owner: callumburnsoregan
--

SELECT pg_catalog.setval('public.users_id_seq', 54, true);


--
-- Name: bookmarks bookmarks_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_pkey PRIMARY KEY (id);


--
-- Name: bookmarks bookmarks_post_id_user_id_key; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_post_id_user_id_key UNIQUE (post_id, profile_id);


--
-- Name: likes likes_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_pkey PRIMARY KEY (id);


--
-- Name: permissions permissions_user_id_key; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_user_id_key UNIQUE (user_id);


--
-- Name: posts posts_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_pkey PRIMARY KEY (id);


--
-- Name: profiles profiles_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_pkey PRIMARY KEY (id);


--
-- Name: likes unique_profile_post_like; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT unique_profile_post_like UNIQUE (profile_id, post_id);


--
-- Name: bookmarks unique_user_post; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT unique_user_post UNIQUE (profile_id, post_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (id);


--
-- Name: users users_username_key; Type: CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_username_key UNIQUE (username);


--
-- Name: bookmarks bookmarks_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: bookmarks bookmarks_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.bookmarks
    ADD CONSTRAINT bookmarks_user_id_fkey FOREIGN KEY (profile_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: likes likes_post_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_post_id_fkey FOREIGN KEY (post_id) REFERENCES public.posts(id) ON DELETE CASCADE;


--
-- Name: likes likes_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.likes
    ADD CONSTRAINT likes_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: permissions permissions_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.permissions
    ADD CONSTRAINT permissions_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- Name: posts posts_parent_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_parent_id_fkey FOREIGN KEY (parent_id) REFERENCES public.posts(id) ON DELETE SET NULL;


--
-- Name: posts posts_profile_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.posts
    ADD CONSTRAINT posts_profile_id_fkey FOREIGN KEY (profile_id) REFERENCES public.profiles(id) ON DELETE CASCADE;


--
-- Name: profiles profiles_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: callumburnsoregan
--

ALTER TABLE ONLY public.profiles
    ADD CONSTRAINT profiles_id_fkey FOREIGN KEY (id) REFERENCES public.users(id) ON DELETE CASCADE;


--
-- PostgreSQL database dump complete
--


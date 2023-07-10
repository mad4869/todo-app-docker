--
-- PostgreSQL database cluster dump
--

SET default_transaction_read_only = off;

SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;

--
-- Roles
--

CREATE ROLE postgres;
ALTER ROLE postgres WITH SUPERUSER INHERIT CREATEROLE CREATEDB LOGIN REPLICATION BYPASSRLS PASSWORD 'SCRAM-SHA-256$4096:HWm9fPyxgfOzL8TeG4mIqg==$4fGXZ+k94Wzo5BKtWMkbn00dDHbfcEwgaLAbLiEwh+0=:twsRR/V3zHlMnCabBuw6eY+eq+siwmuLCrb8QO+FFqk=';

--
-- User Configurations
--








--
-- Databases
--

--
-- Database "template1" dump
--

\connect template1

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "postgres" dump
--

\connect postgres

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- PostgreSQL database dump complete
--

--
-- Database "todo-db" dump
--

--
-- PostgreSQL database dump
--

-- Dumped from database version 15.3 (Debian 15.3-1.pgdg120+1)
-- Dumped by pg_dump version 15.3 (Debian 15.3-1.pgdg120+1)

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
SET client_encoding = 'UTF8';
SET standard_conforming_strings = on;
SELECT pg_catalog.set_config('search_path', '', false);
SET check_function_bodies = false;
SET xmloption = content;
SET client_min_messages = warning;
SET row_security = off;

--
-- Name: todo-db; Type: DATABASE; Schema: -; Owner: postgres
--

CREATE DATABASE "todo-db" WITH TEMPLATE = template0 ENCODING = 'UTF8' LOCALE_PROVIDER = libc LOCALE = 'en_US.utf8';


ALTER DATABASE "todo-db" OWNER TO postgres;

\connect -reuse-previous=on "dbname='todo-db'"

SET statement_timeout = 0;
SET lock_timeout = 0;
SET idle_in_transaction_session_timeout = 0;
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
-- Name: alembic_version; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.alembic_version (
    version_num character varying(32) NOT NULL
);


ALTER TABLE public.alembic_version OWNER TO postgres;

--
-- Name: blocklist_token; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.blocklist_token (
    token_id integer NOT NULL,
    jti character varying(36) NOT NULL
);


ALTER TABLE public.blocklist_token OWNER TO postgres;

--
-- Name: blocklist_token_token_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.blocklist_token_token_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.blocklist_token_token_id_seq OWNER TO postgres;

--
-- Name: blocklist_token_token_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.blocklist_token_token_id_seq OWNED BY public.blocklist_token.token_id;


--
-- Name: projects; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.projects (
    project_id integer NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(250),
    user_id integer,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.projects OWNER TO postgres;

--
-- Name: projects_project_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.projects_project_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.projects_project_id_seq OWNER TO postgres;

--
-- Name: projects_project_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.projects_project_id_seq OWNED BY public.projects.project_id;


--
-- Name: todos; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.todos (
    todo_id integer NOT NULL,
    title character varying(100) NOT NULL,
    description character varying(250),
    project_id integer,
    is_done boolean NOT NULL,
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.todos OWNER TO postgres;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.todos_todo_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.todos_todo_id_seq OWNER TO postgres;

--
-- Name: todos_todo_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.todos_todo_id_seq OWNED BY public.todos.todo_id;


--
-- Name: users; Type: TABLE; Schema: public; Owner: postgres
--

CREATE TABLE public.users (
    user_id integer NOT NULL,
    name character varying(50) NOT NULL,
    role character varying(50) NOT NULL,
    email character varying(50) NOT NULL,
    password_hash character varying(100) NOT NULL,
    bio character varying(1000),
    created_at timestamp without time zone NOT NULL
);


ALTER TABLE public.users OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE; Schema: public; Owner: postgres
--

CREATE SEQUENCE public.users_user_id_seq
    AS integer
    START WITH 1
    INCREMENT BY 1
    NO MINVALUE
    NO MAXVALUE
    CACHE 1;


ALTER TABLE public.users_user_id_seq OWNER TO postgres;

--
-- Name: users_user_id_seq; Type: SEQUENCE OWNED BY; Schema: public; Owner: postgres
--

ALTER SEQUENCE public.users_user_id_seq OWNED BY public.users.user_id;


--
-- Name: blocklist_token token_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocklist_token ALTER COLUMN token_id SET DEFAULT nextval('public.blocklist_token_token_id_seq'::regclass);


--
-- Name: projects project_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects ALTER COLUMN project_id SET DEFAULT nextval('public.projects_project_id_seq'::regclass);


--
-- Name: todos todo_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos ALTER COLUMN todo_id SET DEFAULT nextval('public.todos_todo_id_seq'::regclass);


--
-- Name: users user_id; Type: DEFAULT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users ALTER COLUMN user_id SET DEFAULT nextval('public.users_user_id_seq'::regclass);


--
-- Data for Name: alembic_version; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.alembic_version (version_num) FROM stdin;
e24dbf14d2e5
\.


--
-- Data for Name: blocklist_token; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.blocklist_token (token_id, jti) FROM stdin;
\.


--
-- Data for Name: projects; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.projects (project_id, title, description, user_id, created_at) FROM stdin;
\.


--
-- Data for Name: todos; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.todos (todo_id, title, description, project_id, is_done, created_at) FROM stdin;
\.


--
-- Data for Name: users; Type: TABLE DATA; Schema: public; Owner: postgres
--

COPY public.users (user_id, name, role, email, password_hash, bio, created_at) FROM stdin;
\.


--
-- Name: blocklist_token_token_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.blocklist_token_token_id_seq', 1, false);


--
-- Name: projects_project_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.projects_project_id_seq', 1, false);


--
-- Name: todos_todo_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.todos_todo_id_seq', 1, false);


--
-- Name: users_user_id_seq; Type: SEQUENCE SET; Schema: public; Owner: postgres
--

SELECT pg_catalog.setval('public.users_user_id_seq', 1, false);


--
-- Name: alembic_version alembic_version_pkc; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.alembic_version
    ADD CONSTRAINT alembic_version_pkc PRIMARY KEY (version_num);


--
-- Name: blocklist_token blocklist_token_jti_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocklist_token
    ADD CONSTRAINT blocklist_token_jti_key UNIQUE (jti);


--
-- Name: blocklist_token blocklist_token_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.blocklist_token
    ADD CONSTRAINT blocklist_token_pkey PRIMARY KEY (token_id);


--
-- Name: projects projects_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_pkey PRIMARY KEY (project_id);


--
-- Name: todos todos_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_pkey PRIMARY KEY (todo_id);


--
-- Name: users users_email_key; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_email_key UNIQUE (email);


--
-- Name: users users_pkey; Type: CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.users
    ADD CONSTRAINT users_pkey PRIMARY KEY (user_id);


--
-- Name: projects projects_user_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.projects
    ADD CONSTRAINT projects_user_id_fkey FOREIGN KEY (user_id) REFERENCES public.users(user_id);


--
-- Name: todos todos_project_id_fkey; Type: FK CONSTRAINT; Schema: public; Owner: postgres
--

ALTER TABLE ONLY public.todos
    ADD CONSTRAINT todos_project_id_fkey FOREIGN KEY (project_id) REFERENCES public.projects(project_id);


--
-- PostgreSQL database dump complete
--

--
-- PostgreSQL database cluster dump complete
--


"""empty message

Revision ID: f1396627976f
Revises: c082c5784592
Create Date: 2023-06-22 18:40:21.004152

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision = 'f1396627976f'
down_revision = 'c082c5784592'
branch_labels = None
depends_on = None


def upgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.create_table('blocklist_token',
    sa.Column('token_id', sa.Integer(), nullable=False),
    sa.Column('jti', sa.String(length=36), nullable=False),
    sa.PrimaryKeyConstraint('token_id'),
    sa.UniqueConstraint('jti')
    )
    # ### end Alembic commands ###


def downgrade():
    # ### commands auto generated by Alembic - please adjust! ###
    op.drop_table('blocklist_token')
    # ### end Alembic commands ###